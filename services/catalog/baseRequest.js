const utils = require('../../utils');
const { AppError, ErrorCode, ForwardError } = require('../../appError');
const CachingService = require('../caching');
const CircuitBreaker = require('../circuitBreaker/v1.0');

const baseUrl = process.env.MPX_URL;

const catalogCacheService = new CachingService('{mpx}', 10);

const requestCommand = CircuitBreaker({
    name: 'mpx',
    configs: process.env.MPX_CB_CONFIGS,
    onError: (error) => {
        if (error instanceof AppError) {
            const isFailed = (error.code === ErrorCode.Catalog.General);
            return isFailed ? error : false;
        }

        return AppError.wrap(error);
    },
    onFallback: async (error, args) => { // eslint-disable-line
        if (args[0].cacheKey) {
            const cache = await catalogCacheService.get(args[0].cacheKey);
            return (!cache) ? Promise.reject(error) : cache;
        }
        return Promise.reject(error);
    }
});

class BaseRequest {
    constructor() {
        this._defaultQueryParams = {
            form: 'cjson'
        };
    }

    async get() {
        try {
            const cache = await this.getCachedResponse();
            if (cache) {
                return cache;
            }
            return await this.executeCommand();
        } catch (err) {
            throw new AppError(ErrorCode.Catalog.General, err);
        }
    }

    async executeCommand() {
        return requestCommand.execute(this);
    }

    async send() {
        const queryParams = Object.assign({}, this._defaultQueryParams, this.queryParams);
        try {
            this._response = await utils.request('MPX', {
                method: 'GET',
                uri: `${baseUrl}`,
                json: true,
                qs: queryParams
            });
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                this._errorStatus = err.statusCode;
                this._errorStack = err.stack;
                this._error = err.error ? err.error : err;
                return this.error;
            }
        }
        const { response } = this;
        this.saveResponseCache(response);
        await this.deleteRelatedCache();
        return response;
    }

    /**
     * Determine if errors includes the code
     * @param {string} code Catalog Service error code
     * @returns {boolean}
     */
    isErrorCode(code) {
        return this._error && this._error.code === code;
    }

    get isSuccess() {
        return (this._response) ? !this._response.isException : false;
    }

    get error() {
        if (this._error.error) {
            throw new ForwardError(this._errorStatus, this._error.error, this._errorStack);
        } else {
            throw new AppError(ErrorCode.Catalog.General, this._error);
        }
    }

    async getCachedResponse() {
        if (!this.cacheKey) { return null; }
        return catalogCacheService.get(this.cacheKey);
    }

    async saveResponseCache(data) {
        return this.cacheKey ? catalogCacheService.save(this.cacheKey, data) : null;
    }

    async deleteRelatedCache() {
        if (!this.relatedCacheKeys.length) { return null; }

        return catalogCacheService.delete(this.relatedCacheKeys);
    }

    get cacheKey() {
        return false;
    }

    /**
     * Related cache keys to be deleted upon successful non-cached request
     * @returns {String[]}
     */
    get relatedCacheKeys() {
        return [];
    }
}

module.exports = BaseRequest;

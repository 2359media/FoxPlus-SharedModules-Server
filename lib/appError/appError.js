const { log } = require('./../utils');
const { ErrorCode } = require('./errorCode');

class AppError extends Error {
    /**
     * @constructor
     * @param {ErrorCode} errorCode
     * @param {Error} error orignal error
     * @param {Array<string>} details message details
     */
    constructor(errorCode, error = (new Error()), details = []) {
        super(AppError._code(errorCode));

        this._errorCode = errorCode;
        this._error = error instanceof AppError ? error._error : error;
        this._details = details;
    }

    /**
     * Wrap Error to AppError
     * @param {Error} error
     */
    static wrap(error) {
        return error instanceof AppError ? error : new AppError(ErrorCode.General.InternalServerError, error);
    }

    toString() {
        return `${AppError._code(this._errorCode)} ${this._error.stack}`;
    }

    toJSON() {
        if (this.code.http >= 500) {
            log(this.toString());
        }

        const errorCode = this._errorCode;
        return {
            error: {
                code: AppError._code(errorCode),
                message: errorCode.message,
                details: this._details
            }
        };
    }

    get status() {
        return this._errorCode.http;
    }

    get code() {
        return this._errorCode;
    }

    get name() {
        return this._errorCode.message;
    }

    static _code(errorCode) {
        const service = `0${errorCode.service}`.slice(-2);
        const code = `0${errorCode.code}`.slice(-2);
        return `${errorCode.prefix}${errorCode.http}${service}${code}`;
    }
}

module.exports = AppError;

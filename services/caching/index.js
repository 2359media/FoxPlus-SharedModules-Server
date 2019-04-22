const redis = require('../redis');
const utils = require('../../utils');

class CachingService {
    constructor(prefix, expiry) {
        this._prefix = prefix;
        this._expiry = expiry;
    }

    async get(key) {
        try {
            const keyWithPrefix = `${this._prefix}:${key}`;
            const cache = JSON.parse(await redis.get(keyWithPrefix));

            if (cache) {
                utils.log(`${this._prefix} [CACHE] GET Hit: ${key}`);
                return cache;
            }
            utils.log(`${this._prefix} [CACHE] GET Missing: ${key}`);
            return null;
        } catch (err) {
            utils.log(`${this._prefix} [CACHE] GET Error: ${err.message}`);
            return null;
        }
    }

    async getMultipleData(keys) {
        try {
            const keysWithPrefix = keys.map(key => `${this._prefix}:${key}`);
            const data = (await redis.mget(keysWithPrefix))
                .map(d => JSON.parse(d))
                .filter(x => !!x);
            if (data.length > 0) {
                utils.log(`${this._prefix} [CACHE] GET MULTIPLE Hit: ${utils.inspect(keys)}`);
            } else {
                utils.log(`${this._prefix} [CACHE] GET MULTIPLE Missing: ${utils.inspect(keys)}`);
            }
            return data;
        } catch (err) {
            utils.log(`${this._prefix} [CAdCHE] GET MULTIPLE Error: ${err.message}`);
            return [];
        }
    }

    async setMultipleData(data) {
        try {
            const keyData = [];
            data.forEach((d) => {
                keyData.push(`${this._prefix}:${d.key}`);
                keyData.push(d.data);
            });
            return redis.mset(...keyData);
        } catch (err) {
            utils.log(`${this._prefix} [CACHE] SET MULTIPLE Error: ${err.message}`);
            return [];
        }
    }

    async save(key, data) {
        try {
            const keyWithPrefix = `${this._prefix}:${key}`;
            const cache = data;

            const setExpire = this._expiry ? ['EX', this._expiry] : [];
            return redis.set(keyWithPrefix, JSON.stringify(cache), ...setExpire);
        } catch (err) {
            utils.log(`${this._prefix} [CACHE] SAVE Error: ${err.message}`);
            return null;
        }
    }

    async delete(keys) {
        try {
            const keysWithPrefix = keys.map(key => `${this._prefix}:${key}`);
            const deletedCount = await redis.del(...keysWithPrefix);
            return deletedCount;
        } catch (err) {
            utils.log(`${this._prefix} [CACHE] DEL Error: ${err.message}`);
            return null;
        }
    }
}

module.exports = CachingService;

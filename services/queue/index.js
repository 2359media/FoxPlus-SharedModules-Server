
const redis = require('../redis');
const utils = require('../../utils');

const QUEUE_LIMIT = process.env.REFRESH_MEDIA_CACHCE_LIMIT || 100;
const INITIAL_SCORE = 1000;
const INCREMENT = 1;

class QueueService {
    constructor(prefix) {
        this._prefix = prefix;
    }

    async add(key, value) {
        try {
            return value ? redis.zincrby(this._prefix, INCREMENT, key) : redis.zadd(this._prefix, INITIAL_SCORE, key);
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] ADD Error: ${err.message}`);
            return null;
        }
    }

    async a() {
        try {
            const data = await redis.zrevrange(this._prefix, 0, -1, 'WITHSCORES');
            return data;
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] ADD MULTIPLE Error: ${err.message}`);
            return null;
        }
    }

    async addMultiple(keys) {
        try {
            const data = await redis.zrevrange(this._prefix, 0, -1, 'WITHSCORES');
            const keysWithScore = [];
            keys.forEach((key) => {
                const keyWithPrefix = `${this._prefix}:${key}`;
                const keyScore = data.indexOf(keyWithPrefix) === -1
                    ? INITIAL_SCORE : parseInt(data[data.indexOf(keyWithPrefix) + 1], 10) + INCREMENT;
                keysWithScore.push(keyScore);
                keysWithScore.push(keyWithPrefix);
            });
            return redis.zadd(this._prefix, ...keysWithScore);
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] ADD MULTIPLE Error: ${err.message}`);
            return null;
        }
    }

    async get() {
        try {
            return redis.zrevrange(this._prefix, 0, QUEUE_LIMIT - 1);
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] GET Error: ${err.message}`);
            return [];
        }
    }

    async del(keys) {
        try {
            return redis.zrem(this._prefix, keys);
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] DEL Error: ${err.message}`);
            return null;
        }
    }

    async roundRobin(keys) {
        try {
            const keysWithScore = [];
            keys.forEach((key) => {
                const keyWithPrefix = `${this._prefix}:${key}`;
                keysWithScore.push(INITIAL_SCORE);
                keysWithScore.push(keyWithPrefix);
            });
            await this.del(keys);
            return redis.zadd(this._prefix, ...keysWithScore);
        } catch (err) {
            utils.log(`${this._prefix} [QUEUE] ROUND ROBIN Error: ${err.message}`);
            return null;
        }
    }
}

module.exports = QueueService;

const Redis = require('ioredis');

const {
    MPX_REDIS_URL,
    MPX_REDIS_HOST,
    MPX_REDIS_PORT,
    MPX_REDIS_PASSWORD
} = process.env;

const config = MPX_REDIS_URL || {
    host: MPX_REDIS_HOST,
    port: MPX_REDIS_PORT,
    password: MPX_REDIS_PASSWORD
};

const client = new Redis.Cluster([config], {
    scaleReads: 'slave'
});

module.exports = client;

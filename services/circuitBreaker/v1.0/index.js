const hystrix = require('hystrixjs');
const { AppError, ErrorCode } = require('../../../appError');

/**
 * Wrap request in a circuit breaker
 * @param {*} options
 * @param {string} options.name circuit breaker name
 * @param {string} options.configs circuit breaker environment variable
 * [TIMEOUT, ERROR_THRESHOLD, VOLUME_THESHOLD, SLEEP_WINDOW]
 * @param {Function} options.onError handler function on request error (error) => {}
 * @param {Function} options.onFallback handler function on fallback (error, args) => {}
 * @returns {*} { execute: content => context.send() }
 */
module.exports = (options) => {
    const {
        name, configs, onError, onFallback
    } = options;

    if (!configs) { return { execute: context => context.send() }; }

    const [
        timeout, errorThreshold, volumeThreshold, sleepWindow
    ] = configs.split(',').map(config => parseInt(config, 10));

    if (!timeout || !errorThreshold || !volumeThreshold || !sleepWindow) {
        throw new AppError(ErrorCode.General.InvalidConfiguration);
    }

    const requestCommand = hystrix.commandFactory.getOrCreate(name)
        .circuitBreakerErrorThresholdPercentage(errorThreshold)
        .circuitBreakerRequestVolumeThreshold(volumeThreshold)
        .circuitBreakerSleepWindowInMilliseconds(sleepWindow)
        .timeout(timeout)
        .run(context => context.send())
        .errorHandler(onError)
        .fallbackTo(onFallback)
        .build();

    return requestCommand;
};

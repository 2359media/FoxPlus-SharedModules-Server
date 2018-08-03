const morgan = require('morgan');

const logEndFormat = '[:req[requestLogId]] END :method :url :req[country] :req[platform] ' +
'HTTP/:http-version :status :res[content-length] - :response-time ms ' +
'- :req[sessionid] :req[deviceid] :req[profileid]';

module.exports = {
    /**
     * Request Logger Middleware -- Log at Start of Request
     */
    requestLogStart: morgan(
        '[:req[requestLogId]] START :method :url :req[country] :req[platform] BODY',
        { immediate: true }
    ),

    /**
     * Request Logger Middleware -- Log at End of Request
     */
    requestLogEnd: morgan(logEndFormat)
};

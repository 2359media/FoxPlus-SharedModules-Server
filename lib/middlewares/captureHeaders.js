const uuid = require('uuid');
const httpContext = require('express-http-context');

module.exports = (req, res, next) => {
    const {
        'cloudfront-jwt-id': sessionid = null,
        'cloudfront-jwt-accountid': accountid = null,
        'cloudfront-jwt-profileid': profileid = null,
        'cloudfront-jwt-deviceid': deviceid = null,
        'cloudfront-jwt-platform': platform = null,
        'cloudfront-jwt-evtoken': evtoken = null,
        'cloudfront-jwt-evpartner': evpartner = null,
        'cloudfront-jwt-token': authorization = null,
        'cloudfront-viewer-country': countryCode = null
    } = req.headers;

    const country = (countryCode || '').toLowerCase();
    Object.assign(req.headers, {
        sessionid, accountid, profileid, deviceid, platform, evtoken, evpartner, authorization, country
    });

    const ipaddress = req.header('X-Forwarded-For') || req.connection.remoteAddress || '0.0.0.0';
    Object.assign(req.headers, { ipaddress });

    const requestId = req.header('X-Request-Id') || uuid.v4();
    const requestLogId = requestId.split('-').slice(-1)[0];
    req.headers.requestlogid = requestLogId;
    res.header('X-Request-Id', requestId);
    httpContext.set('requestLogId', requestLogId);
    return next();
};

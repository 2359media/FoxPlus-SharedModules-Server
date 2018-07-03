import uuid from 'uuid';
import httpContext from 'express-http-context';

export default function (req, res, next) {
    const {
        'cloudfront-jwt-id': sessionid = null,
        'cloudfront-jwt-accountid': accountid = null,
        'cloudfront-jwt-profileid': profileid = null,
        'cloudfront-jwt-deviceid': deviceid = null,
        'cloudfront-jwt-platform': platform = null,
        'cloudfront-jwt-evtoken': evtoken = null,
        'cloudfront-jwt-token': authorization = null,
        'cloudfront-viewer-country': country = null
    } = req.headers;

    Object.assign(req.headers, {
        sessionid, accountid, profileid, deviceid, platform, evtoken, authorization, country
    });

    const ipaddress = req.header('X-Forwarded-For') || req.connection.remoteAddress || '0.0.0.0';
    Object.assign(req.headers, { ipaddress });

    const requestId = req.header('X-Request-Id') || uuid.v4();
    const requestLogId = requestId.split('-').slice(-1)[0];
    req.headers.requestlogid = requestLogId;
    res.header('X-Request-Id', requestId);
    httpContext.set('requestLogId', requestLogId);
    return next();
}

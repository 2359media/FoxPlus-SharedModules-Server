const AppError = require('./lib/appError/appError');
const ForwardError = require('./lib/appError/forwardError');
const HttpStatus = require('./lib/appError/httpStatus');
const { ErrorCode, createError, initializeErrors } = require('./lib/appError/errorCode');

const createDatabase = require('./lib/createDatabase');
const createServer = require('./lib/createServer');
const { Route, route } = require('./lib/router');
const Utility = require('./lib/utils');

module.exports = {
    AppError,
    ForwardError,
    HttpStatus,
    ErrorCode,
    createError,
    initializeErrors,
    createDatabase,
    createServer,
    Route,
    route,
    Utility
};

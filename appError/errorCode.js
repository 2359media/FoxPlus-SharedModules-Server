const HttpStatus = require('./httpStatus');

/**
 * Form ErrorCode
 * @param {number} service unique service code
 * @param {number} code unique error code per category
 * @param {HttpStatus} http HTTP status code
 */
const createError = (service, code, http = HttpStatus.InternalServerError) => ({ service, code, http });

const ErrorCode = {
    General: {
        InternalServerError: createError(0, 0),
        BadRequest: createError(0, 1, HttpStatus.BadRequest),
        NotImplemented: createError(0, 2, HttpStatus.NotImplemented),
        InvalidParameters: createError(0, 3, HttpStatus.BadRequest),
    }
};

/**
 * Initialize ErrorCodes
 * @param {ErrorCode} errorCode
 * @param {string} prefix
 */
const initializeErrors = (errorCode, prefix) => {
    for (const i of Object.keys(errorCode)) {
        for (const j of Object.keys(errorCode[i])) {
            ErrorCode[i][j].message = `${i} ${j}`;
            ErrorCode[i][j].prefix = prefix;
        }
    }
};


initializeErrors(ErrorCode, 'fpx');

module.exports = { createError, initializeErrors, ErrorCode };

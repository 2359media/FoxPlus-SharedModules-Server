import HttpStatus from './httpStatus';

/**
 * Form ErrorCode
 * @param {number} service unique service code
 * @param {number} code unique error code per category
 * @param {HttpStatus} http HTTP status code
 */
export const _error = (service, code, http = HttpStatus.InternalServerError) => ({ service, code, http });

/**
 * Initialize ErrorCodes
 * @param {ErrorCode} errorCode
 * @param {string} prefix 
 */
export const initializeErrors = (errorCode, prefix) => {
    for (const i of Object.keys(errorCode)) {
        for (const j of Object.keys(errorCode[i])) {
            ErrorCode[i][j].message = `${i} ${j}`;
            ErrorCode[i][j].prefix = prefix;
        }
    }    
}

export const ErrorCode = {
    General: {
        InternalServerError: _error(0, 0),
        BadRequest: _error(0, 1, HttpStatus.BadRequest),
        NotImplemented: _error(0, 2, HttpStatus.NotImplemented),
        InvalidParameters: _error(0, 3, HttpStatus.BadRequest),
    }
};

initializeErrors(ErrorCode, 'fpx');

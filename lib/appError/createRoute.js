const { Route } = require('./../router');
const AppError = require('./appError');
const HttpStatus = require('./httpStatus');

module.exports = (errorCodes) => {
    const handler = (req, res) => {
        const errors = {};
        for (const group of Object.keys(errorCodes)) {
            for (const code of Object.keys(errorCodes[group])) {
                const errorCode = errorCodes[group][code];
                errors[AppError._code(errorCode)] = errorCode.message;
            }
        }
        res.status(HttpStatus.Ok).json(errors);
    };

    class ErrorCodeRoute extends Route {
        constructor(prefix, router) {
            super(prefix, '', router);
        }

        create() {
            this.route({
                module: 'error',
                constroller: {
                    index: handler
                }
            });
        }
    }

    return ErrorCodeRoute;
};

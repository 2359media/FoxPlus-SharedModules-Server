const Route = require('./router');
const { AppError, HttpStatus } = require('./../appError');

module.exports = (errorCodes) => {
    class ErrorCodeController {
        static index(req, res) {
            const errors = [];
            for (const group of Object.keys(errorCodes)) {
                for (const code of Object.keys(errorCodes[group])) {
                    const errorCode = errorCodes[group][code];
                    errors.push({
                        group,
                        code: AppError._code(errorCode),
                        message: errorCode.message
                    });
                }
            }
            res.status(HttpStatus.Ok).json(errors);
        }
    }

    class ErrorCodeRoute extends Route {
        constructor(prefix, router) {
            super(prefix, '', router);
        }

        create() {
            this.route({
                module: 'error',
                controller: ErrorCodeController
            });
        }
    }

    return ErrorCodeRoute;
};

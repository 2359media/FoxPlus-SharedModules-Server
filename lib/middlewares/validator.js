const Ajv = require('ajv');
const { inspect } = require('./../utils');
const { AppError, ErrorCode } = require('./../appError');

class Validator {
    /**
     * Create validator based on schemas; Schema & Controller should have the same properties
     * @param {Object} schemas validator schemas
     */
    static create(schemas) {
        const ajv = new Ajv({ format: 'full' });
        const validator = {};

        for (const key of Object.keys(schemas)) {
            validator[key] = (req, res, next) => {
                const { params, query, body } = req;
                const validate = ajv.compile(schemas[key]);
                const valid = validate(Validator._mergeParams(query, body, params));

                if (!valid) {
                    const details = validate.errors.map(Validator._mapError);
                    const error = new AppError(ErrorCode.General.InvalidParameters, (new Error()), details);
                    return res.status(error.status).json(error);
                }

                return next();
            };
        }

        return validator;
    }

    static _mapError(e) {
        return process.env.LOG_DETAILS !== 'disabled'
            ? `${e.dataPath} ${e.message} with ${inspect(e.params)}`
            : '';
    }

    static _mergeParams(...args) {
        let params = {};
        for (const arg of args) {
            params = Object.assign(params, arg);
        }
        return params;
    }
}

module.exports = Validator;

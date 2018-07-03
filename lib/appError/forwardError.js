import { log } from './../utils';
import AppError from './appError';

export class ForwardError extends AppError {
    /**
     * @constructor
     * @param {integer} http http status code
     * @param {object} error forwarded error
     * @param {string} error.code forwarded error code
     * @param {string} error.message forwarded error message
     * @param {Array<string>} error.details forwarded eror details
     */
    constructor(http, error, stack = (new Error())) {
        super(error.code);

        this._http = http;
        this._error = error;
        this._stack = stack;
    }

    toString() {
        return `${this._error.code} ${this._stack}`;
    }

    toJSON() {
        if (this._http >= 500) {
            log(this.toString());
        }

        return {
            error: {
                code: this._error.code,
                message: this._error.message,
                details: this._error.details
            }
        };
    }

    get status() {
        return this._http;
    }

    get code() {
        return this._error.code;
    }

    get name() {
        return this._error.message;
    }
}

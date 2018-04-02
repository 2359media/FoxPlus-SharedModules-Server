"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["RecordNotFound"] = 1] = "RecordNotFound";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
function errorStatus(code) {
    switch (code) {
        case ErrorCode.RecordNotFound:
            return controller_1.HttpStatus.NotFound;
        default:
            return controller_1.HttpStatus.InternalServerError;
    }
}
class AppError {
    constructor(code, err, details) {
        this.code = code;
        this.origin = err;
        this.details = details;
        this.stack = (new Error()).stack;
    }
    toString() {
        const details = this.details instanceof Array ? this.details.slice() : [this.details];
        return details.toString();
    }
    status() {
        return errorStatus(this.code);
    }
    data() {
        return {
            error: {
                code: this.status() + `00${this.code}`.slice(-3),
                message: this.humanize(ErrorCode[this.code]),
                details: this.toString(),
                origin: this.origin,
                stack: this.stack
            }
        };
    }
    humanize(camel) {
        const words = [];
        const capRe = /[A-Z]/;
        for (let i = 0; i < camel.length; i++) {
            words.push(i <= 0 ? camel[i] : capRe.test(camel[i]) ? ` ${camel[i]}` : camel[i]);
        }
        return words.join('');
    }
}
exports.AppError = AppError;

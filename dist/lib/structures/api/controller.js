"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["Ok"] = 200] = "Ok";
    HttpStatus[HttpStatus["Created"] = 201] = "Created";
    HttpStatus[HttpStatus["NoContent"] = 204] = "NoContent";
    HttpStatus[HttpStatus["BadRequest"] = 400] = "BadRequest";
    HttpStatus[HttpStatus["Unautorized"] = 401] = "Unautorized";
    HttpStatus[HttpStatus["PaymentRequired"] = 402] = "PaymentRequired";
    HttpStatus[HttpStatus["Forbidden"] = 403] = "Forbidden";
    HttpStatus[HttpStatus["NotFound"] = 404] = "NotFound";
    HttpStatus[HttpStatus["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpStatus[HttpStatus["NotAcceptable"] = 406] = "NotAcceptable";
    HttpStatus[HttpStatus["Gone"] = 410] = "Gone";
    HttpStatus[HttpStatus["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    HttpStatus[HttpStatus["InternalServerError"] = 500] = "InternalServerError";
    HttpStatus[HttpStatus["NotImplemented"] = 501] = "NotImplemented";
    HttpStatus[HttpStatus["BadGateway"] = 502] = "BadGateway";
    HttpStatus[HttpStatus["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpStatus[HttpStatus["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpStatus = exports.HttpStatus || (exports.HttpStatus = {}));
class Response {
    static success(status, data, expiredIn) {
        return {
            json: data ? data : null,
            status,
            expiredIn
        };
    }
    static error(error, expiredIn) {
        return {
            json: error.data(),
            status: error.status(),
            expiredIn
        };
    }
}
exports.Response = Response;
class Controller {
}
exports.Controller = Controller;

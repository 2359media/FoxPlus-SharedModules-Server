"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["ok"] = 200] = "ok";
    HttpStatus[HttpStatus["created"] = 201] = "created";
    HttpStatus[HttpStatus["noContent"] = 202] = "noContent";
    HttpStatus[HttpStatus["badRequest"] = 400] = "badRequest";
    HttpStatus[HttpStatus["unautorized"] = 401] = "unautorized";
    HttpStatus[HttpStatus["paymentRequired"] = 402] = "paymentRequired";
    HttpStatus[HttpStatus["forbidden"] = 403] = "forbidden";
    HttpStatus[HttpStatus["notFound"] = 404] = "notFound";
    HttpStatus[HttpStatus["methodNotAllowed"] = 405] = "methodNotAllowed";
    HttpStatus[HttpStatus["notAcceptable"] = 406] = "notAcceptable";
    HttpStatus[HttpStatus["gone"] = 410] = "gone";
    HttpStatus[HttpStatus["unprocessableEntity"] = 422] = "unprocessableEntity";
    HttpStatus[HttpStatus["internalServerError"] = 500] = "internalServerError";
    HttpStatus[HttpStatus["notImplemented"] = 501] = "notImplemented";
    HttpStatus[HttpStatus["badGateway"] = 502] = "badGateway";
    HttpStatus[HttpStatus["serviceUnavailable"] = 503] = "serviceUnavailable";
    HttpStatus[HttpStatus["gatewayTimeout"] = 504] = "gatewayTimeout";
})(HttpStatus = exports.HttpStatus || (exports.HttpStatus = {}));
/**
 * Controller function response object
 */
var Response = /** @class */ (function () {
    function Response(response) {
        this.response = response;
    }
    Response.prototype.json = function (res) {
        return res.json ? this.response.status(res.status).json(res.json) : this.response.status(res.status);
    };
    return Response;
}());
exports.Response = Response;

/// <reference types="express" />
import { Response as BaseResponse } from 'express';
/**
 * Controller function json response object
 */
export interface ResponseType {
    json: Object | null;
    status: HttpStatus;
    expiredIn?: number;
}
export declare enum HttpStatus {
    ok = 200,
    created = 201,
    noContent = 202,
    badRequest = 400,
    unautorized = 401,
    paymentRequired = 402,
    forbidden = 403,
    notFound = 404,
    methodNotAllowed = 405,
    notAcceptable = 406,
    gone = 410,
    unprocessableEntity = 422,
    internalServerError = 500,
    notImplemented = 501,
    badGateway = 502,
    serviceUnavailable = 503,
    gatewayTimeout = 504,
}
/**
 * Controller function response object
 */
export declare class Response {
    private response;
    constructor(response: BaseResponse);
    json(res: ResponseType): BaseResponse;
}

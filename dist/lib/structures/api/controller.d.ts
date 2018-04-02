/// <reference types="express" />
import { Request } from "express";
import { AppError } from "./appError";
export declare enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 202,
    BadRequest = 400,
    Unautorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    Gone = 410,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}
export interface IRequestHandler {
    (req: Request): IResponse | Promise<IResponse>;
}
export interface IResponse {
    json: object | null;
    status: HttpStatus;
    expiredIn?: number;
}
export declare class Response {
    static success(status: HttpStatus.Ok | HttpStatus.Created | HttpStatus.NoContent, data?: object, expiredIn?: number): IResponse;
    static error(error: AppError, expiredIn?: number): IResponse;
}
export declare class Controller {
    [action: string]: any;
}

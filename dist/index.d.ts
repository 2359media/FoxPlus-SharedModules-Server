import * as apiController from './lib/structures/api/controller';
import * as apiRoute from './lib/structures/api/route';
import * as apiError from './lib/structures/api/appError';
export declare namespace FoxPlusStructure {
    export import ApiController = apiController.Controller;
    export import ApiResponse = apiController.Response;
    export import IRequestHandler = apiController.IRequestHandler;
    export import IResponse = apiController.IResponse;
    export import HttpStatus = apiController.HttpStatus;
    export import ApiRoute = apiRoute.Route;
    export import IRouteMapper = apiRoute.IRouteMapper;
    export import AppError = apiError.AppError;
    export import ErrorCode = apiError.ErrorCode;
}

import * as apiController from './lib/structures/api/controller';
import * as apiRoute from './lib/structures/api/route';
export declare namespace FoxPlusStructure {
    namespace Api {
        export import HttpStatus = apiController.HttpStatus;
        export import Controller = apiController.Controller;
        export import IRequestHandler = apiController.IRequestHandler;
        export import IResponse = apiController.IResponse;
        export import Route = apiRoute.Route;
        export import IRouteMapper = apiRoute.IRouteMapper;
    }
}

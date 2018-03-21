import { Request, Response, Router, RequestHandler, NextFunction } from "express";
import { ApiController } from "./apiController";

/**
 * Interface for mapping action and method to add to router
 */
interface RouteMapper {
    method: string;
    action: string;
    collection: boolean;
}

/**
 * Base class to route API controllers
 */
export abstract class ApiRoute {

    protected prefix: string;
    protected router: Router;

    /**
     * Route a router with prefix following versioned route
     * 
     * @class ApiRoute
     * @param router application router
     * @param prefix prefix to the path (for example, namespace)
     * @param Route versioned route
     */
    public static route(router: Router, prefix: string, Route: new (prefix: string, router: Router) => ApiRoute) {
        new Route(prefix, router);
    }

    /**
     * Constructor
     *
     * @class ApiRoute
     * @param prefix {string} the path prefix
     * @param version {string} the api version
     * @param router {Router} the router object
     * @constructor
     */
    constructor(prefix: string, version: string, router: Router) {
        this.prefix = `${prefix}/${version}`;
        this.router = router;

        this.create();
    }

    protected abstract create(): void;

    /**
     * Add controller routes to the application router
     * Action index, show, create, update and destroy are added by default
     * Path to the default actions can be overridden by `options`
     * 
     * @class ApiRoute
     * @param module module name (singular preferred)
     * @param controller module controller
     * @param options route mappers
     */
    protected route(module: string, controller: ApiController, options?: Array<RouteMapper>) {
        const defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'post', action: 'create', collection: true },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false }
        ]

        defaults.forEach((mapper) => {
            if (controller[mapper.action]) {
                let path: string = `/${module}${mapper.collection ? 's' : '/:id'}`;
                this[mapper.method](path, controller[mapper.action]);
            }
        })

        if (options) {
            options.forEach((mapper) => {
                let path: string = `/${module}${mapper.collection ? 's' : '/:id'}/${mapper.action}`;
                this[mapper.method](path, controller[mapper.action]);                
            })    
        }
    }

    /**
     * Add GET method to application route
     * 
     * @class ApiRoute
     * @param path route path
     * @param handler request handler
     */
    protected get(path: string, handler: RequestHandler) {
        this.routeMethod('get', path, handler);
    }

    /**
     * Add POST method to application route
     * 
     * @class ApiRoute
     * @param path route path
     * @param handler request handler
     */
    protected post(path: string, handler: RequestHandler) {
        this.routeMethod('post', path, handler);
    }

    /**
     * Add PUT method to application route
     * 
     * @class ApiRoute
     * @param path route path
     * @param handler request handler
     */
    protected put(path: string, handler: RequestHandler) {
        this.routeMethod('put', path, handler);
    }

    /**
     * Add DELETE method to application route
     * 
     * @class ApiRoute
     * @param path route path
     * @param handler request handler
     */
    protected delete(path: string, handler: RequestHandler) {
        this.routeMethod('delete', path, handler);
    }

    private routeMethod(method: string, path: string, handler: RequestHandler) {
        this.router[method](`${this.prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
            handler(req, res, next);
        })        
    }
}
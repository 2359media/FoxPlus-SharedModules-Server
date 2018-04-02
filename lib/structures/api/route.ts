import { Request, Response, Router, NextFunction } from "express";
import { Controller as ApiController, IRequestHandler as ApiHandler } from "./controller";
import Promise from "bluebird";
import pluralize from "pluralize";

/**
 * Interface for mapping action and method to add to router
 */
export interface IRouteMapper {
    method: string;
    action: string;
    collection: boolean;
}

/**
 * Base class to route API controllers
 */
export abstract class Route {

    protected prefix: string;
    protected router: Router;
    [index: string]: any;

    /**
     * Route a router with prefix following versioned route
     * 
     * @class Route
     * @param router application router
     * @param prefix prefix to the path (for example, namespace)
     * @param Route versioned route
     */
    public static route(router: Router, prefix: string, Route: new (prefix: string, router: Router) => Route) {
        new Route(prefix, router);
    }

    /**
     * Constructor
     *
     * @class Route
     * @param prefix {string} the path prefix
     * @param version {string} the api version
     * @param router {Router} the router object
     * @constructor
     */
    constructor(prefix: string, version: string | null, router: Router) {
        this.prefix = version ? `${prefix}/${version}` : prefix;
        this.router = router;

        this.create();
    }

    protected abstract create(): void;

    /**
     * Add controller routes to the application router
     * Action index, show, create, update and destroy are added by default
     * Path to the default actions can be overridden by `options`
     * 
     * @class Route
     * @param module module name (singular preferred)
     * @param controller module controller
     * @param options route mappers
     */
    protected route(module: string, controller: ApiController, options?: ReadonlyArray<IRouteMapper>) {
        const defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'post', action: 'create', collection: true },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false }
        ]

        defaults.forEach((mapper) => {
            if (controller[mapper.action]) {
                let path: string = '/' + (mapper.collection ? pluralize(module) : `${module}/:id`);
                this[mapper.method](path, controller[mapper.action]);
            }
        })

        if (options) {
            options.forEach((mapper) => {
                let path: string = '/' + (mapper.collection ? pluralize(module) : `${module}/:id`) + `/${mapper.action}`;
                this[mapper.method](path, controller[mapper.action]);                
            })    
        }
    }

    /**
     * Add GET method to application route
     * 
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected get(path: string, handler: ApiHandler) {
        this.router.get(`${this.prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(handler(req))
                .then(response => res.status(response.status).json(response.json))
        })  
    }

    /**
     * Add POST method to application route
     * 
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected post(path: string, handler: ApiHandler) {
        this.router.post(`${this.prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(handler(req))
                .then(response => res.status(response.status).json(response.json))
        })  
    }

    /**
     * Add PUT method to application route
     * 
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected put(path: string, handler: ApiHandler) {
        this.router.put(`${this.prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(handler(req))
                .then(response => res.status(response.status).json(response.json))
        })  
    }

    /**
     * Add DELETE method to application route
     * 
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected delete(path: string, handler: ApiHandler) {
        this.router.delete(`${this.prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(handler(req))
                .then(response => res.status(response.status).json(response.json))
        })  
    }
}

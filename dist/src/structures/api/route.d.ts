/// <reference types="express" />
import { Router, RequestHandler } from "express";
import { Controller } from "./controller";
import { RouteMapper } from "./routeMapper";
/**
 * Base class to route API controllers
 */
export declare abstract class Route {
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
    static route(router: Router, prefix: string, Route: new (prefix: string, router: Router) => Route): void;
    /**
     * Constructor
     *
     * @class Route
     * @param prefix {string} the path prefix
     * @param version {string} the api version
     * @param router {Router} the router object
     * @constructor
     */
    constructor(prefix: string, version: string, router: Router);
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
    protected route(module: string, controller: Controller, options?: ReadonlyArray<RouteMapper>): void;
    /**
     * Add GET method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected get(path: string, handler: RequestHandler): void;
    /**
     * Add POST method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected post(path: string, handler: RequestHandler): void;
    /**
     * Add PUT method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected put(path: string, handler: RequestHandler): void;
    /**
     * Add DELETE method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    protected delete(path: string, handler: RequestHandler): void;
}
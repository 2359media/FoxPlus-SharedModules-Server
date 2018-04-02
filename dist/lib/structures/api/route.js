"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = __importDefault(require("pluralize"));
/**
 * Base class to route API controllers
 */
class Route {
    /**
     * Route a router with prefix following versioned route
     *
     * @class Route
     * @param router application router
     * @param prefix prefix to the path (for example, namespace)
     * @param Route versioned route
     */
    static route(router, prefix, Route) {
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
    constructor(prefix, version, router) {
        this.prefix = version ? `${prefix}/${version}` : prefix;
        this.router = router;
        this.create();
    }
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
    route(module, controller, options) {
        const defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'post', action: 'create', collection: true },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false }
        ];
        defaults.forEach((mapper) => {
            if (controller[mapper.action]) {
                let path = '/' + (mapper.collection ? pluralize_1.default(module) : `${module}/:id`);
                this[mapper.method](path, controller[mapper.action]);
            }
        });
        if (options) {
            options.forEach((mapper) => {
                let path = '/' + (mapper.collection ? pluralize_1.default(module) : `${module}/:id`) + `/${mapper.action}`;
                this[mapper.method](path, controller[mapper.action]);
            });
        }
    }
    /**
     * Add GET method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    get(path, handler) {
        this.router.get(`${this.prefix}${path}`, (req, res, next) => {
            let response = handler(req);
            res.status(response.status).json(response.json);
        });
    }
    /**
     * Add POST method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    post(path, handler) {
        this.router.post(`${this.prefix}${path}`, (req, res, next) => {
            let response = handler(req);
            res.status(response.status).json(response.json);
        });
    }
    /**
     * Add PUT method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    put(path, handler) {
        this.router.put(`${this.prefix}${path}`, (req, res, next) => {
            let response = handler(req);
            res.status(response.status).json(response.json);
        });
    }
    /**
     * Add DELETE method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    delete(path, handler) {
        this.router.delete(`${this.prefix}${path}`, (req, res, next) => {
            let response = handler(req);
            res.status(response.status).json(response.json);
        });
    }
}
exports.Route = Route;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var pluralize_1 = __importDefault(require("pluralize"));
/**
 * Base class to route API controllers
 */
var Route = /** @class */ (function () {
    /**
     * Constructor
     *
     * @class Route
     * @param prefix {string} the path prefix
     * @param version {string} the api version
     * @param router {Router} the router object
     * @constructor
     */
    function Route(prefix, version, router) {
        this.prefix = prefix + "/" + version;
        this.router = router;
        this.create();
    }
    /**
     * Route a router with prefix following versioned route
     *
     * @class Route
     * @param router application router
     * @param prefix prefix to the path (for example, namespace)
     * @param Route versioned route
     */
    Route.route = function (router, prefix, Route) {
        new Route(prefix, router);
    };
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
    Route.prototype.route = function (module, controller, options) {
        var _this = this;
        var defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'post', action: 'create', collection: true },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false }
        ];
        defaults.forEach(function (mapper) {
            if (controller[mapper.action]) {
                var path = '/' + (mapper.collection ? pluralize_1.default(module) : module + "/:id");
                _this[mapper.method](path, controller[mapper.action]);
            }
        });
        if (options) {
            options.forEach(function (mapper) {
                var path = '/' + (mapper.collection ? pluralize_1.default(module) : module + "/:id") + ("/" + mapper.action);
                _this[mapper.method](path, controller[mapper.action]);
            });
        }
    };
    /**
     * Add GET method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    Route.prototype.get = function (path, handler) {
        this.router.get("" + this.prefix + path, function (req, res, next) {
            handler(req, res, next);
        });
    };
    /**
     * Add POST method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    Route.prototype.post = function (path, handler) {
        this.router.post("" + this.prefix + path, function (req, res, next) {
            handler(req, res, next);
        });
    };
    /**
     * Add PUT method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    Route.prototype.put = function (path, handler) {
        this.router.put("" + this.prefix + path, function (req, res, next) {
            handler(req, res, next);
        });
    };
    /**
     * Add DELETE method to application route
     *
     * @class Route
     * @param path route path
     * @param handler request handler
     */
    Route.prototype.delete = function (path, handler) {
        this.router.delete("" + this.prefix + path, function (req, res, next) {
            handler(req, res, next);
        });
    };
    return Route;
}());
exports.Route = Route;

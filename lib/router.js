const pluralize = require('pluralize');
const { Router } = require('express');
const { Validator } = require('./middlewares/validator');
const { AppError, ErrorCode } = require('./appError');

class Route {
    constructor(prefix, version, router) {
        this._prefix = version ? `${prefix}/${version}` : prefix;
        this._router = router;
    }

    get router() {
        return this._router;
    }

    create() {}

    /**
     * @typedef Mapper
     * @prop {string} method
     * @prop {string} action
     * @prop {boolean} collection
     */
    /**
     * @param {Object} options
     * @param {string} options.module route name (singular)
     * @param {Controller} options.constroller route handlers
     * @param {Validator} options.schemas router handlers' schema
     * @param {Array<Mapper>} options.mappers route mapper options
     * @param {Array<Middleware>} options.middlewares route middlewares
     */
    route(options) {
        const {
            module: module = '',
            controller: controller = {},
            schemas: schemas = {},
            mappers: mappers = [],
            middlewares: middlewares = []
        } = options;

        const defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'post', action: 'create', collection: true },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false },
            { method: 'delete', action: 'clear', collection: true }
        ];

        middlewares.push(Validator.create(schemas)); // Ex: For parsing form-data body before validation

        for (const mapper of defaults) {
            if (controller[mapper.action]) {
                const path = (mapper.collection ? `/${pluralize(module)}` : `/${module}/:id`);
                const middles = middlewares.map(m => m[mapper.action]).filter(m => !!m);
                this._routeSingle(mapper.method, path, middles, controller[mapper.action]);
            }
        }

        for (const mapper of mappers) {
            let path = (mapper.collection ? `/${pluralize(module)}` : `/${module}/:id`);
            path += `/${mapper.action}`;

            const middles = middlewares.map(m => m[mapper.action]).filter(m => !!m);
            this._routeSingle(mapper.method, path, middles, controller[mapper.action]);
        }
    }

    _routeSingle(method, path, middles, handler) {
        this._router[method](`${this._prefix}${path}`, middles, async (req, res) => {
            try {
                await Promise.resolve(handler(req, res));
            } catch (err) {
                const error = AppError.wrap(err);
                res.status(error.status).json(error);
            }
        });
    }
}

module.exports = {
    Route,
    /**
     * Route Express Router based on Route
     * @param {Router} router 
     * @param {string} prefix 
     * @param {Route} ChildRoute 
     */
    route: (router, prefix, ChildRoute) => (new ChildRoute(prefix, router)).create()
}

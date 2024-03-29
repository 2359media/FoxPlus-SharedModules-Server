const pluralize = require('pluralize');
const Validator = require('./middlewares/validator');
const { AppError } = require('./../appError');
const { log, inspect } = require('./../utils');

class Route {
    constructor(prefix, version, router) {
        this._prefix = version ? `${prefix}/${version}` : prefix;
        this._version = version || null;
        this._router = router;
    }

    get router() {
        return this._router;
    }

    create() {}

    /**
     * Use the given middleware function, with optional path, defaulting to "/"
     */
    use(...args) {
        this._router.use.apply(this._router, ...args);
    }

    /**
     * @typedef Mapper
     * @prop {string} method
     * @prop {string} action
     * @prop {boolean} collection
     * @prop {string} path
     */
    /**
     * @param {Object} options
     * @param {string} options.module route name (singular)
     * @param {Controller} options.controller route handlers
     * @param {Validator} options.schemas router handlers' schema
     * @param {Array<Mapper>} options.mappers route mapper options
     * @param {Array<Middleware>} options.middlewares route middlewares
     */
    route({
        module = '',
        controller = {},
        schemas = {},
        mappers = [],
        middlewares = []
    }) {
        const defaults = [
            { method: 'get', action: 'index', collection: true },
            { method: 'post', action: 'create', collection: true },
            { method: 'patch', action: 'bulk', collection: true },
            { method: 'delete', action: 'clear', collection: true },
            { method: 'get', action: 'show', collection: false },
            { method: 'put', action: 'update', collection: false },
            { method: 'delete', action: 'destroy', collection: false }
        ];

        middlewares.push(Validator.create(schemas)); // Ex: For parsing form-data body before validation

        for (const mapper of defaults) {
            if (controller[mapper.action]) {
                const path = (mapper.collection ? `/${pluralize(module)}` : `/${module}/:id`);
                const middles = this._fetchMiddlewares(middlewares, mapper.action);
                this._routeSingle(mapper.method, path, middles, controller, mapper.action);
            }
        }

        for (const mapper of mappers) {
            if (!mapper.path) {
                mapper.path = mapper.collection ? `/${pluralize(module)}` : `/${module}/:id`;
                mapper.path += `/${mapper.action}`;
            }

            const middles = this._fetchMiddlewares(middlewares, mapper.action);
            this._routeSingle(mapper.method, mapper.path, middles, controller, mapper.action);
        }
    }

    _routeSingle(method, path, middles, controller, action) {
        this._router[method](
            `${this._prefix}${path}`,
            middles,
            this._routeHandle.bind(null, this._version, controller, action)
        );
    }

    _fetchMiddlewares(middlewares, action) {
        return middlewares.map(m => m[action]).filter(m => !!m);
    }

    async _routeHandle(version, controller, action, req, res) {
        log(`PROCESS ${controller.name}#${action} ${inspect({
            version,
            params: req.params,
            query: req.query,
            body: req.body
        })}`);

        try {
            await Promise.resolve(controller[action](req, res));
        } catch (err) {
            const error = AppError.wrap(err);
            res.status(error.status).json(error);
        }
    }
}

module.exports = Route;

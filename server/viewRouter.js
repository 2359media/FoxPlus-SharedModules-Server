const Route = require('./router');
const { static: serveStatic } = require('express');

class ViewRoute extends Route {
    constructor(prefix, version, router, app) {
        super(prefix, version, router);
        this._app = app;
    }

    get router() {
        return this._router;
    }

    create() {}

    /**
     * Use the given middleware function, with optional path, defaulting to "/"
     */
    use() {
        this._router.use.apply(this._router, arguments);
    }

    /**
     * Use asset path
     * @param {string} path
     * @param {string} file
     */
    asset(path, file) {
        this._router.use(`/assets${this._prefix}${path}`, serveStatic(file));
    }

    /**
     * Set View Engine and View Path
     * @param {string} engine
     * @param {string} folder
     */
    view(engine, folder) {
        this._app.set('views', folder);
        this._app.set('view engine', engine);
    }

    _fetchMiddlewares(middlewares, action) {
        return middlewares.map(m => m.any || m[action]).filter(m => !!m);
    }
}

module.exports = ViewRoute;

const Route = require('./router');

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

    set() {
        this._app.set.apply(this._app, arguments);
    }

    _fetchMiddlewares(middlewares, action) {
        return middlewares.map(m => m.any || m[action]).filter(m => !!m);
    }
}

module.exports = ViewRoute;

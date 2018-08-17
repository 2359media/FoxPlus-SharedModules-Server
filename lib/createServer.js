if (process.env.NODE_ENV === 'development') {
    const config = require('dotenv'); // eslint-disable-line
    config();
} else {
    const newrelic = require('newrelic'); // eslint-disable-line
}

const express = require('express');
const cors = require('cors');
const httpContext = require('express-http-context');
const bodyParser = require('body-parser');
const { requestLogStart, requestLogEnd } = require('./middlewares/logger');
const { captureHeaders } = require('./middlewares/captureHeaders');
const createErrorCodeRoute = require('./appError/createRoute');

const { route } = require('./router');
const { log } = require('./utils');

/**
 * create server
 * @param {string} name service name
 * @param {Array<route>} routers versions of router
 * @param {object} options other options
 * @param {ErrorCode} options.errorCode
 */
module.exports = (name, routers, options) => {
    const app = express();
    app.disable('x-powered-by');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cors());
    app.use(httpContext.middleware);
    app.use(captureHeaders);
    app.use(requestLogStart);
    app.use(requestLogEnd);

    const router = express.Router();
    for (const _route of routers) {
        route(router, '', _route);
    }
    if (options.errorCode) {
        route(router, '', createErrorCodeRoute(options.errorCode));
    }
    app.use(`/${name.toLowerCase()}`, router);
    app.use('/', (req, res) => {
        res.send(`${name} Service Ready`);
    });

    app.set('port', (parseInt(process.env.PORT || '', 10) || 3000));
    const server = app.listen(app.get('port'), () => {
        log(`${name} Service running on port: ${app.get('port')}`);
    });

    return { app, server };
};

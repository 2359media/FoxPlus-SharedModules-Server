if (process.env.NODE_ENV === 'development') {
    require('dotenv').config(); // eslint-disable-line
} else {
    require('newrelic'); // eslint-disable-line
}

const express = require('express');
const cors = require('cors');
const httpContext = require('express-http-context');
const bodyParser = require('body-parser');
const { requestLogStart, requestLogEnd } = require('./middlewares/logger');
const captureHeaders = require('./middlewares/captureHeaders');
const createErrorRoute = require('./createErrorRoute');
const { log } = require('./../utils');

/**
 * create server
 * @param {object} options
 * @param {string} options.name service name
 * @param {Array<route>} options.routes versions of api route
 * @param {Array<viewRoute>} options.viewRoutes cms route
 * @param {ErrorCode} options.errorCode
 */
module.exports = ({
    name,
    routes,
    viewRoutes,
    ErrorCode
}) => {
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
    if (routes instanceof Array) {
        for (const _Route of routes) {
            (new _Route('', router)).create();
        }
    }

    if (ErrorCode && process.env.NODE_ENV === 'development') {
        const ErrorRoute = createErrorRoute(ErrorCode);
        (new ErrorRoute('', router)).create();
    }
    app.use(`/${name.toLowerCase()}`, router);

    if (viewRoutes instanceof Array) {
        const viewRouter = express.Router();
        for (const _Route of viewRoutes) {
            (new _Route('', viewRouter, app)).create();
        }
        app.use('/', viewRouter);
    } else {
        app.use('/', (req, res) => {
            res.send(`${name} Service Ready`);
        });
    }


    app.set('port', (parseInt(process.env.PORT || '', 10) || 3000));
    const server = app.listen(app.get('port'), () => {
        log(`${name} Service running on port: ${app.get('port')}`);
    });

    return { app, server };
};

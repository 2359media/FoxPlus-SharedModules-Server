if (process.env.NODE_ENV === 'development') {
    const config = require('dotenv');
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

const { route } = require('./router');

/**
 * create server
 * @param {string} name service name 
 * @param {Array<route>} routers versions of router
 */
module.exports = (name, routers) => {
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
    app.use(`/${name.toLowerCase()}`, router);
    app.use('/', (req, res) => {
        res.send(`${name} Service Ready`);
    });
    
    app.use(errorHandler());
    
    app.set('port', (parseInt(process.env.PORT || '', 10) || 3000));
    const server = app.listen(app.get('port'), () => {
        Console.log(`${name} Service running on port: ${app.get('port')}`);
    });

    return { app, server };
}

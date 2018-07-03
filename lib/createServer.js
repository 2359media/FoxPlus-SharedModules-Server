if (process.env.NODE_ENV === 'development') {
    import config from 'dotenv';
    config();
} else {
    import newrelic from 'newrelic'; // eslint-disable-line
}

import express from 'express';
import cors from 'cors';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import { requestLogStart, requestLogEnd } from './middlewares/logger';
import { captureHeaders } from './middlewares/captureHeaders';

import { route } from './router';

export default function (name, routers) {
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

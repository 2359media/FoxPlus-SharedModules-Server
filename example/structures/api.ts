import express from 'express';
import { Route } from '../../src/structures/api/route';
import { Controller } from '../../src/structures/api/controller';

export class TaskController extends Controller {
    public static index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.json({
            origin: req.path,
            params: req.params,
            query: req.query,
            headers: req.headers
        })
    }
}

export class TaskRoute extends Route {
    constructor(prefix: string, router: express.Router) {
        super(prefix, null, router);
    }

    protected create() {
        this.route('task', TaskController);
    }
}

export class Server {
    public app: express.Application;
    public router: express.Router;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.router = express.Router();

        this.config();
        this.routes();
        this.serve();
    }

    public config() {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        err = new Error('Not Found');
        err.status = 404;
        next(err);
        });
    }

    private routes() {
        let router: express.Router;
        router = express.Router();

        Route.route(router, '/:group', TaskRoute);
        this.app.use('/example', router);
    }

    private serve() {
        let port: number;
        port = parseInt(process.env.PORT || '') || 1343;

        this.app.set('port', port);
        this.app.listen(this.app.get('port'), () => {
        console.log(`Task Server running on port: ${this.app.get('port')}`);
        });    
    }
}

Server.bootstrap();

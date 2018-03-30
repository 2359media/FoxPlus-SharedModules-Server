import express from 'express';
import { FoxPlusStructure } from './../../dist/index';

export class TaskController extends FoxPlusStructure.Api.Controller {
    public static index: FoxPlusStructure.Api.IRequestHandler = (req: express.Request): FoxPlusStructure.Api.IResponse => {
        return {
            json: {
                origin: req.path,
                params: req.params,
                query: req.query,
                headers: req.headers
            },
            status: FoxPlusStructure.Api.HttpStatus.Ok
        }
    }
}

export class TaskRoute extends FoxPlusStructure.Api.Route {
    constructor(prefix: string, router: express.Router) {
        super(prefix, null, router);
    }

    protected create() {
        this.route('project/:projectId/task', TaskController);
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

        FoxPlusStructure.Api.Route.route(router, '/:group', TaskRoute);
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

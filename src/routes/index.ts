import * as express from 'express';
import * as http from 'http';
import AuthRouter from './AuthRouter';
import { AuthComponent } from '../components';

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();

    /**
     * @description Forwards any requests to the /auth URI to our AuthRouter
     * @constructs
     */

    app.get('/health', (req, res) => {
        try {
            res.status(200).json({
                code: 200,
                error: false,
                message: 'health check is active',
            });
        } catch (error) {
            res.status(400).json({
                code: 400,
                error: false,
                message: 'health check has failed',
            });
        }
    });

    app.use(express.json());

    app.use('/api', AuthRouter);

    /**
     * @description No results returned mean the object is not found
     * @constructs
     */
    app.use((req, res) => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    /**
     * @constructs all routes
     */
    app.use(router);
}

import * as express from 'express';
import * as Middleware from '../middleware/middleware';
import * as Routes from '../../routes';
// import botHelper from "../helpers/tgbot.helper";
/**
 * @constant {express.Application}
 */
const app: express.Application = express();

/**
 * @constructs express.Application Middleware
 */
Middleware.configure(app);

/**
 * @constructs express.Application Routes
 */
Routes.init(app);

/**
 * @constructs express.Application Error Handler
 */
Middleware.initErrorHandler(app);

/**
 * sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 9000);

/**
 * sets secret to 'superSecret', otherwise specified in the environment
 */
app.set('secret', process.env.SECRET || 'superSecret');

/**
 * starts telegram bot helper
 */
// botHelper.start();
/**
 * @exports {express.Application}
 */
export default app;

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import logger from './utils/logger';
import { blockingShutdownHandlers } from './utils/shutdown';
import { DEV, ENVIRONMENT } from './utils/environment';

process.title = 'mad-cowz-server';

const expressServer = express();

if (ENVIRONMENT === DEV) {
    const WEBPACK_CONFIG_FILE = process.env.WEBPACK_CONFIG_FILE || '../webpack.config.js';
    logger.info(`Serving files using webpack-dev, configuration in ${WEBPACK_CONFIG_FILE}`, {'scope': 'dev'});
    const compiler = webpack(require(WEBPACK_CONFIG_FILE));

    expressServer.use(webpackMiddleware(compiler, /* {logLevel: webpackLogLevel,} */));
    expressServer.use(webpackHotMiddleware(compiler));
}
expressServer.use(express.static('../dist/public'));
expressServer.use(compression());
expressServer.use(errorHandler());

// Define routes here - they will probably just be JSON endpoints

expressServer.set('port', process.env.PORT || 3000);

setImmediate(async () => {
    expressServer.listen(expressServer.get('port'), () => {
        logger.info(`Listening at http://localhost:${expressServer.get('port')}/`, {'scope': 'http'});
    });
});

blockingShutdownHandlers.add(async () => {
    return await setImmediate(() => {
        logger.debug('[HANDLER] Awaited the timeout!');
    });
});

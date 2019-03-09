import { LeveledLogMethod, transports, format, Container } from 'winston';
import { ENVIRONMENT, LOG_FILE, PROD } from './environment';

export const DEFAULT = 'default';

const loggerContainer = new Container();

const globalFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.simple(),
    format.printf(info => {
        const scope = info.scope === DEFAULT ? '' : `[${info.scope}] `;
        return `${info.timestamp} ${info.level} : ${scope}${info.message}`;
    }),
);

export const selectedLogLevel = function () {
    for (let i = 0; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg === '-q') {
            return 'error';
        } else if (arg === '-v') {
            return 'info';
        } else if (arg === '-vv') {
            return 'debug';
        } else if (arg === '-vvv') {
            return 'silly';
        }
    }
    return ENVIRONMENT === PROD ? 'warn' : 'silly';
}();

export let webpackLogLevel = selectedLogLevel;
switch (webpackLogLevel) {
    case 'silly':
        webpackLogLevel = 'debug';
        break;
}

const globalTransports = [
    new transports.Console({
        level: selectedLogLevel,
        format: format.combine(
            format.colorize(),
            globalFormat,
        ),
    }),
    new transports.File({
        filename: LOG_FILE,
        level: selectedLogLevel,
        format: globalFormat,
    })
];

loggerContainer.add(DEFAULT, {
    transports: globalTransports,
    defaultMeta: {
        scope: DEFAULT,
    },
});

// Declare that this logger can only log levels and shadow the other functions because I don't care about them
declare interface LeveledLogger {
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    help: LeveledLogMethod;
    data: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    prompt: LeveledLogMethod;
    http: LeveledLogMethod;
    verbose: LeveledLogMethod;
    input: LeveledLogMethod;
    silly: LeveledLogMethod;
}


const logger = loggerContainer.loggers.get(DEFAULT);

logger.info(`Logging level set to ${selectedLogLevel}.`);

export default logger as LeveledLogger;

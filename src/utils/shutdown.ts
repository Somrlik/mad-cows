import logger from './logger';

const BLOCKING_HANDLER_TIMEOUT = 10000;

type ImmediateShutdownCallback = (() => (number | void));
type BlockingShutdownCallback = (() => Promise<any>);

export let immediateShutdownCallbacks: Set<ImmediateShutdownCallback> = new Set();
export let blockingShutdownHandlers: Set<BlockingShutdownCallback> = new Set();

// process.once('exit', callImmediateHandlers);
process.once('SIGHUP', callImmediateHandlers);
process.once('SIGINT', callImmediateHandlers);
process.once('SIGBREAK', callImmediateHandlers);
function callImmediateHandlers() {
    logger.warn('[KILL] Caught immediate exit event! Exiting now!');
    immediateShutdownCallbacks.forEach((callback: ImmediateShutdownCallback) => {
        callback();
    });
    process.exit(127);
}

process.once('SIGTERM', callBlockingHandlers);
async function callBlockingHandlers() {
    const promises: BlockingShutdownCallback[] = [];
    blockingShutdownHandlers.forEach((callback: BlockingShutdownCallback) => {
        promises.push(async () => {
            const callbackPromise = callback();
            setTimeout(() => {
                logger.error(`[SIGTERM] A handler reached the ${BLOCKING_HANDLER_TIMEOUT}ms limit!`);
                Promise.reject(callbackPromise);
            }, BLOCKING_HANDLER_TIMEOUT);
            return callbackPromise;
        });
    });
    return await Promise.all(promises)
        .catch((reason) => {
            logger.info('[SIGTERM] Failed to resolve all exit handlers!', reason);
        }).finally(() => {
            logger.info('[SIGTERM] Terminating...');
            process.exit(1);
        });
}

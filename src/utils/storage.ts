import Keyv from 'keyv';
import { SQLITE_URL } from './environment';
import logger from './logger';

const instances: Map<string, Keyv> = new Map<string, Keyv>();

export function getStorage<T>(namespace: string) {
    if (! instances.has(namespace)) {
        logger.info(`Loading sqlite database for ${namespace} from ${SQLITE_URL}`);
        instances.set(namespace, new Keyv<T>(SQLITE_URL, { namespace }));
    }
    return instances.get(namespace);
}

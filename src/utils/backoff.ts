import { EventEmitter } from 'events';


class Backoff extends EventEmitter {

    private callee: () => {};

    public async call() {
        await new Promise(resolve => {
            resolve();
            Promise.reject();
        });
    }

}

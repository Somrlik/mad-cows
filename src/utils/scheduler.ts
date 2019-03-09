import { EventEmitter } from 'events';
import Timer = NodeJS.Timer;
import logger from './logger';

const LOG_SCOPE = {scope: 'scheduler'};

const scheduledActions: ScheduledAction[] = [];

export async function schedule(
    name: string,
    description: string,
    action: () => void,
    ms: number,
    immediate: boolean = false
): Promise<ScheduledAction> {
    const scheduled: ScheduledAction = await SingleScheduledAction.create(name, description, action, ms, immediate);
    scheduledActions.push(scheduled);
    scheduled.start();
    return scheduled;
}

export function getScheduledActions(): ScheduledAction[] {
    return scheduledActions;
}

export function stopAll(): void {
    scheduledActions.forEach(scheduledAction => {
        scheduledAction.stop();
    });
}

export interface ScheduledAction {
    readonly name: string;
    readonly description: string;
    readonly action: () => void;
    readonly interval: number;
    start(): void;
    stop(): void;
}

class SingleScheduledAction extends EventEmitter implements ScheduledAction {
    private static readonly TIMEOUT_EVENT_NAME = 'timeout';

    public readonly name: string;
    public readonly description: string;

    public readonly action: () => void;
    public readonly interval: number;
    private handle: Timer;

    private constructor(name: string, description: string, action: () => void, ms: number) {
        super();
        this.name = name;
        this.description = description;
        this.action = action;
        this.interval = ms;
    }

    public static async create(
        name: string,
        description: string,
        action: () => void,
        ms: number,
        immediate: boolean = false,
    ): Promise<ScheduledAction> {
        const created = new SingleScheduledAction(name, description, action, ms);

        created.handle = undefined;
        if (immediate) {
            await created.runAction();
        }
        created.addListener(SingleScheduledAction.TIMEOUT_EVENT_NAME, created.runAction);
        return created;
    }

    private async runAction() {
        try {
            logger.silly(`Running scheduled action '${this.name}'`, LOG_SCOPE);
            await this.action();
            logger.silly(
                `Next execution of scheduled action '${this.name}' is in ${this.interval / 1000} seconds`,
                LOG_SCOPE,
            );
        } catch (e) {
            logger.error(`Failed to perform scheduled action '${this.name}'!`, LOG_SCOPE);
            logger.error(`  with error '${e.message}'`, LOG_SCOPE);
            logger.error('Stopping further execution...', LOG_SCOPE);
            this.stop();
        }
    }

    public start() {
        if (this.handle === undefined) {
            this.handle = setInterval(() => this.emit(SingleScheduledAction.TIMEOUT_EVENT_NAME), this.interval);
        }
    }

    public stop() {
        if (this.handle) {
            clearInterval(this.handle);
            this.handle = undefined;
        }
    }
}

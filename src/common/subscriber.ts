import { Observable } from './observable';

/**
 * @brief Subscriber model to communicate between multiple values
 */
export class Subscriber {
    /// Track queue
    private eventQueue: {
        [_: string]: Array<(data: any) => void>
    } = {};
    private subscriptionMap: {
        [_: string]: Observable<any>
    } = {}

    constructor() { }

    /// This should return a reference to something to the
    /// owner of this subscription
    createSubscription<T>(eventName: string): Observable<T> {
        if (!this.subscriptionMap.hasOwnProperty(eventName)) {
            if (this.eventQueue.hasOwnProperty(eventName)) {
                this.subscriptionMap[eventName] = Observable.createSubscription<T>(eventName, this.eventQueue[eventName]);
                delete this.eventQueue[eventName];
            } else {
                this.subscriptionMap[eventName] = new Observable<T>(eventName);
            }
        } else {
            this.subscriptionMap[eventName] = new Observable<T>(eventName);
        }

        return this.subscriptionMap[eventName];
    }

    unsubscribeToEvent<T>(eventName: string, fn: (data: T) => void) {
        if (this.subscriptionMap.hasOwnProperty(eventName)) {
            this.subscriptionMap[eventName].unsubscribe(fn);
        }
    }

    fire<T>(eventName: string, data?: T) {
        if (this.subscriptionMap.hasOwnProperty(eventName)) {
            this.subscriptionMap[eventName].fire(data);
        }
    }

    subscribeToEvent<T>(eventName: string, fn: (data: T) => void) {
        if (this.subscriptionMap.hasOwnProperty(eventName)) {
            this.subscriptionMap[eventName].subscribe(fn);
        } else if (this.eventQueue.hasOwnProperty(eventName)) {
            this.eventQueue[eventName].push(fn);
        } else {
            this.eventQueue[eventName] = [fn];
        }
    }
}
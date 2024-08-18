/// Creates object that is able to emit an event
export class Observable<T> {
    private subscriptionActionList: Array<(_: T) => void> = [];
    constructor(
        private key: string
    ) {}

    static createSubscription<T>(key: string, subscriptionArray: Array<(_: T) => void>) {
        const newObservable = new Observable<T>(key);
        newObservable.subscriptionActionList = subscriptionArray;
        return newObservable;
    }

    subscribe(fn: (_: T) => void) {
        this.subscriptionActionList.push(fn);
    }

    fire(data: T): void {
        for (let index = 0; index < this.subscriptionActionList.length; ++index) {
            this.subscriptionActionList[index](data);
        }
    }

    unsubscribe(fn: (_: T) => void) {
        for (let index = 0; index < this.subscriptionActionList.length; ++index) {
            const searchFn = this.subscriptionActionList[index];

            if (searchFn === fn) {
                this.subscriptionActionList.splice(index, 1);
            }
        }
    }
}
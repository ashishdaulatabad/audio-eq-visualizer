
export type None = undefined;

export function Some<T>(value: T): Option<T> {
    return new Option(value);
}

export function None<T>(): Option<T> {
    return new Option<T>(undefined);
}

export class Option<T> {
    /**
     * Variable that hold some or none
     */
    some: T | None;

    constructor(value: T | None) { this.some = value }
    /**
     * Returns if it holds value
     * @returns boolean
     */
    isSome() { return !this.isNone(); }
    
    /**
     * Returns if it does not hold
     * @returns boolean
     */
    isNone() { return this.some === undefined || this.some === null; }

    /**
     * @details Get the value defined here.
     * @returns Some value of type T or undefined based on value stored
     */
    get(): T | undefined { return this.some || undefined }


    /**
     * Returns if it holds value and fulfils `fn`
     * @param fn function for additional function
     * @returns 
     */
    isSomeAnd(fn: (_?: T) => boolean): boolean {
        return this.isSome() && fn(this.some);
    }

    /**
     * Map from one value to another
     * @param fn function for mapping
     * @returns Option
     */
    map<U>(fn: (_: T) => U): Option<U> {
        if (this.isSome()) {
            return new Option<U>(fn(this.some as T));
        }
        return new Option<U>(undefined);
    }

    /**
     * @details Map value if value is a valid one
     * otherwise resort to default value
     * @param fn function that perform transformation
     * @param def Default Value
     * @returns Transformed value as Option
     */
    mapOr<U>(fn: (_: T) => U, def: U): Option<U> {
        if (this.isSome()) {
            return new Option<U>(fn(this.some as T));
        }
        return new Option<U>(def);
    }

    /**
     * Perform operation if there is a valid value
     * @param fn function to perform
     * @returns 
     */
    do(fn: (_: T) => void) {
        this.isSome() && fn(this.some as T);
    }

    /**
     * perform operation if value is valid, and returns the value
     * @param fn function to perform
     * @returns 
     */
    doGet(fn: (_: T) => void) {
        if (this.isSome()) {
            fn(this.some as T);
            return this.some;
        }
    }
}

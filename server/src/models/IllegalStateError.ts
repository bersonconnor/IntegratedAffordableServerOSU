export class IllegalStateError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IllegalStateError.prototype);
    }
}
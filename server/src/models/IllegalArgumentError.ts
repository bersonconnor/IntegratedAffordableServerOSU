export class IllegalArgumentError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IllegalArgumentError.prototype);
    }
}
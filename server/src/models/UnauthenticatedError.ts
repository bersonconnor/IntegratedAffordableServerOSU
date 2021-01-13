export class UnauthenticatedError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnauthenticatedError.prototype);
    }
}

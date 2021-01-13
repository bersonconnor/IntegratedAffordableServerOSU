"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = void 0;
class UnauthenticatedError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnauthenticatedError.prototype);
    }
}
exports.UnauthenticatedError = UnauthenticatedError;

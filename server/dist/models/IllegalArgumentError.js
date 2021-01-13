"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalArgumentError = void 0;
class IllegalArgumentError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IllegalArgumentError.prototype);
    }
}
exports.IllegalArgumentError = IllegalArgumentError;

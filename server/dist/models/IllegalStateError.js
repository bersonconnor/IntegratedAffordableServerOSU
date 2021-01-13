"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalStateError = void 0;
class IllegalStateError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IllegalStateError.prototype);
    }
}
exports.IllegalStateError = IllegalStateError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = require("../Validation");
const IllegalArgumentError_1 = require("../../models/IllegalArgumentError");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
describe("Validation Utility tests", () => {
    describe("requireParam Tests", () => {
        test("requireParam allows a defined/truthy object", () => {
            expect(() => Validation_1.Validation.requireParam(1, "someNumber")).not.toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam allows empty string", () => {
            expect(() => Validation_1.Validation.requireParam("", "someNumber")).not.toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam allows 0", () => {
            expect(() => Validation_1.Validation.requireParam(0, "someNumber")).not.toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam allows false", () => {
            expect(() => Validation_1.Validation.requireParam(false, "a field")).not.toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam disallows NaN", () => {
            expect(() => Validation_1.Validation.requireParam(NaN, "someNumber")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam disallows an undefined object", () => {
            expect(() => Validation_1.Validation.requireParam(undefined, "a field")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam disallows a null object", () => {
            expect(() => Validation_1.Validation.requireParam(null, "a field")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireParam using a different error class", () => {
            expect(() => Validation_1.Validation.requireParam(undefined, "a field", UnauthorizedError_1.UnauthorizedError)).toThrow(UnauthorizedError_1.UnauthorizedError);
        });
        test("requireParam for empty string", () => {
            expect(() => Validation_1.Validation.requireParam("", "a string field that can be empty")).not.toThrow();
        });
    });
    describe("requireArray Tests", () => {
        test("requireArray for a null object", () => {
            expect(() => Validation_1.Validation.requireArray(null, "a field")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireArray for an undefined object", () => {
            expect(() => Validation_1.Validation.requireArray(undefined, "a field")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireArray for a different type of object", () => {
            expect(() => Validation_1.Validation.requireArray("i am a string", "a field")).toThrow(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("requireArray for an empty array", () => {
            expect(() => Validation_1.Validation.requireArray([], "a field")).toThrow();
        });
    });
});

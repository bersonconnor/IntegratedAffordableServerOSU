import { Validation } from "../Validation";
import { IllegalArgumentError } from "../../models/IllegalArgumentError";
import { UnauthorizedError } from "../../models/UnauthorizedError";

describe("Validation Utility tests", () => {
    describe("requireParam Tests", () => {
        test("requireParam allows a defined/truthy object", () => {
            expect(() => Validation.requireParam(1, "someNumber")).not.toThrow(IllegalArgumentError);
        });

        test("requireParam allows empty string", () => {
            expect(() => Validation.requireParam("", "someNumber")).not.toThrow(IllegalArgumentError);
        });

        test("requireParam allows 0", () => {
            expect(() => Validation.requireParam(0, "someNumber")).not.toThrow(IllegalArgumentError);
        });

        test("requireParam allows false", () => {
            expect(() => Validation.requireParam(false, "a field")).not.toThrow(IllegalArgumentError);
        });

        test("requireParam disallows NaN", () => {
            expect(() => Validation.requireParam(NaN, "someNumber")).toThrow(IllegalArgumentError);
        });

        test("requireParam disallows an undefined object", () => {
            expect(() => Validation.requireParam(undefined, "a field")).toThrow(IllegalArgumentError);
        });

        test("requireParam disallows a null object", () => {
            expect(() => Validation.requireParam(null, "a field")).toThrow(IllegalArgumentError);
        });

        test("requireParam using a different error class", () => {
            expect(() => Validation.requireParam(undefined, "a field", UnauthorizedError)).toThrow(UnauthorizedError);
        });

        test("requireParam for empty string", () => {
            expect(() => Validation.requireParam("", "a string field that can be empty")).not.toThrow();
        });
    });

    describe("requireArray Tests", () => {
        test("requireArray for a null object", () => {
            expect(() => Validation.requireArray(null, "a field")).toThrow(IllegalArgumentError);
        });

        test("requireArray for an undefined object", () => {
            expect(() => Validation.requireArray(undefined, "a field")).toThrow(IllegalArgumentError);
        });

        test("requireArray for a different type of object", () => {
            expect(() => Validation.requireArray("i am a string", "a field")).toThrow(IllegalArgumentError);
        });

        test("requireArray for an empty array", () => {
            expect(() => Validation.requireArray([], "a field")).toThrow();
        });
    });
});

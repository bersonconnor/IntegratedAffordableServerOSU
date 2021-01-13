import { IllegalArgumentError } from "../models/IllegalArgumentError";

export class Validation {

    /**
     * Verifies that an object exists, i.e. is not null, undefined, NaN
     * Other values like empty string (""), 0, false are allowed
     * @param obj the object to inspect
     * @param fieldName the name of the field to validate (used for an error message)
     * @param errorClazz the type of error to throw. Defaults to {@class IllegalArgumentError} IllegalArgumentError.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static requireParam(obj: any, fieldName: string, errorClazz = IllegalArgumentError): void {
        if (obj === null || obj === undefined || Number.isNaN(obj)) {
            throw new errorClazz(fieldName + " was expected to be defined but was " + String(obj));
        }
    }

    /**
     * Verifies that an object is of type array, is not empty and not null
     * @param obj the object to inspect
     * @param fieldName the name of the field to validate (used for an error message)
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static requireArray(obj: any, fieldName: string): void {
        if (obj == null) {
            throw new IllegalArgumentError(fieldName + " was expected to be defined but was " + String(obj));
        } else if (!Array.isArray(obj)) {
            throw new IllegalArgumentError(fieldName + " was expected to be an array but was actually " + String(typeof obj));
        } else if (obj.length == 0) { 
            throw new IllegalArgumentError(fieldName + " was expected to be a non-empty array, but was actually empty.");
        }
    }

}
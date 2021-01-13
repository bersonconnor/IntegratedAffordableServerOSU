
export class FormValidation {
    static validIfNonEmpty(value): boolean {
        return value.length > 0;
    }

    static validIfDefined(value): boolean {
        return !(value === undefined);
    }

    static validIfNonNullNonEmptyString(value): boolean {
        return value != null && value !== '';
    }

    static validIfOfLength(value, length: number): boolean {
        return value.length === length;
    }
}
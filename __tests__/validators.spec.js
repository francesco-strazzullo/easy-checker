import validators from '../lib/validators'

describe('validators: string', () => {
    const stringValidator = validators.String;

    test('should throw when a number is provided', () => {
        expect(() => {
           stringValidator(1,'dummy');
        }).toThrow();
    });

    test('should throw when a boolean is provided', () => {
        expect(() => {
            stringValidator(false,'dummy');
        }).toThrow();
    });

    test('should not throw when a string is provided', () => {
        expect(() => {
            stringValidator('String','dummy');
        }).not.toThrow();
    });

    test('should not throw when undefined is provided', () => {
        expect(() => {
            stringValidator(undefined,'dummy');
        }).not.toThrow();
    });
});

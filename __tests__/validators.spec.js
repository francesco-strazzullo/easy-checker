import validators from '../lib/validators'

describe('validators: string', () => {
    const stringValidator = validators.String;

    test('should throw when a number is provided', () => {
        expect(() => {
           stringValidator(1,'dummy');
        }).toThrow();
    });
});

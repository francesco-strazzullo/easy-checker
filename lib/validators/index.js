const typeOfValidatorFactory = (expectation) => {
    return (value, name) => {

        //undefined values should be considered 'good'
        if(value === undefined){
            return
        }

        if (typeof value !== expectation) {
            throw new Error(`${value.constructor.name} is not a valid for '${name}' property. Should be String`);
        }
    }
};

export default {
    'String': typeOfValidatorFactory('string'),
    'Number': typeOfValidatorFactory('number'),
    'Boolean': typeOfValidatorFactory('boolean'),
};

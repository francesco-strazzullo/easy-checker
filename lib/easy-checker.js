import validators from './validators';

const typeValidation = (constraint, name, value) => {
    if(!constraint.type){
        return;
    }

    const validator = validators[constraint.type.name] || (() => {});

    validator(value, name);
};

const validate = (constraint, name, value) => {
    typeValidation(constraint, name, value);
};

export default ({target, constraints}) => {
    let proxy;

    const set = (target, name, value) => {
        const constraint = constraints[name];

        if (!constraint) {
            throw new Error(`${name} is not a valid property for this object`);
        }

        validate(constraint, name, value);

        target[name] = value;

        return true;
    };

    const handler = {
        set
    };

    proxy = new Proxy(target, handler);

    return proxy;
};
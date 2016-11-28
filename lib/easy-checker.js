import validators from './validators';

export default ({target, definition}) => {
    let proxy;

    const set = (target, name, value) => {
        const currentDefinition = definition[name];

        if (!currentDefinition) {
            throw new Error(`${name} is not a valid property for this object`);
        }

        const validator = validators[currentDefinition.name] || (() => {});

        validator(value, name);

        target[name] = value;

        return true;
    };

    const handler = {
        set
    };

    proxy = new Proxy(target, handler);

    return proxy;
};
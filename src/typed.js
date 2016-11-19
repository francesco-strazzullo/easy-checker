export default ({target, definition}) => {
    let proxy;

    const set = (target,name,value) => {
        if(!definition[name]){
            throw new Error(`${name} is not a valid property for this object`);
        }

        if(definition[name] === String && typeof value !== 'string'){
            throw new Error(`${value.constructor.name} is not a valid for '${name}' property. Should be ${definition[name].name}`);
        } else if (definition[name] === Number && typeof value !== 'number'){
            throw new Error(`${name.constructor.name} is not a valid for this property. Should be ${definition[name].name}`);
        }

        target[name] = value;

        return true;
    };

    const handler = {
        set
    };

    proxy = new Proxy(target,handler);

    return proxy;
};
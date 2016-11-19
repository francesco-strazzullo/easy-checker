const typed = ({target, definition}) => {
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

const DEFINITION = {
    name: String,
    surname: String,
    age: Number
};

const INITITAL_TARGET = {
    name: 'Francesco'
};

const person = typed({
    target:INITITAL_TARGET,
    definition:DEFINITION}
);

const printToDOM = () => {
    document.getElementById('data').innerText = JSON.stringify(person,undefined,2);
    document.getElementById('error').innerText = "";
};

const setSurname = (surname) => {
    person.surname = surname;
    printToDOM();
};

const setAge = (age) => {
    person.age = age;
    printToDOM();
};

const onerror = (event) => {
    document.getElementById('error').innerText = event;
    return false;
};

Object.assign(window,{
    setAge,
    setSurname,
    onerror
});

printToDOM();

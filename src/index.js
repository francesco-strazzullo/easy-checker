import typed from './typed';

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

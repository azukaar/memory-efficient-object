
const {schemaEngine, MEObject} = require('./index');

const schema = {
    "name" : "string(10)",
};

let testSchema = schemaEngine.add(schema);

// 2nd argument optional values

let test = new MEObject(testSchema, { 
    name: 'asd',
});

// ...set some values
// ....

console.log(test.toJson());

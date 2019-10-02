
const {schemaEngine, MEObject} = require('./index');

const schema = {
    "id" : "uint(2)",
    "letter" : "char",
    "isBlue" : "bool",
    "size" : "uint(32)",
    "x" : "int(32)",
    "name" : "string(4)",
    "coords" : "uint(8)[3]",
    "lights" : "bool[3]"
};

let testSchema = schemaEngine.add(schema);

// 2nd argument optional values

let test = new MEObject(testSchema, { 
    id: 3,
    letter: 'A',
    isBlue: true,
    size: 4294967295,
    x: -5000,
    name: 'Yann',
    coords: [ 1, 2, 3 ],
    lights: [ true, false, true ]
});

// ...set some values
// ....

console.log(test.toJson());

/*
Will display :
{ id: 3,
  letter: 'A',
  isBlue: true,
  size: 4294967295,
  x: -5000,
  name: 'Yann',
  coords: [ 1, 2, 3 ],
  lights: [ true, false, true ] }
*/

console.log(test.serialize());

/*
    Will display: ǿ￿￿￬硙慮渁ȃԀ
    As you can appreciate, this is a much smaller string (10 char vs. 150).
*/

// serialize then unserialize
let testUnSerialised = new MEObject(testSchema, test.serialize());
console.log(testUnSerialised.toJson());

// will re-display the same JSON object again after unserialization 

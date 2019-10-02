const {schemaEngine, MEObject} = require('../index');
const assert = require('assert');

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

describe('Documentation', function() {
  it('is accurate', function() {
    assert.deepEqual(test.toJson(), { 
      id: 3,
      letter: 'A',
      isBlue: true,
      size: 4294967295,
      x: -5000,
      name: 'Yann',
      coords: [ 1, 2, 3 ],
      lights: [ true, false, true ]
    });

    assert.equal(test.serialize().length, 21);

    let testUnSerialised = new MEObject(testSchema, test.serialize());
    assert.deepEqual(testUnSerialised.toJson(), { 
      id: 3,
      letter: 'A',
      isBlue: true,
      size: 4294967295,
      x: -5000,
      name: 'Yann',
      coords: [ 1, 2, 3 ],
      lights: [ true, false, true ]
    });
  });
    
});
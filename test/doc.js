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
  it('is accurate 1', function() {
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
  });

  it('is accurate 2', function() {
    assert.equal(test.serialize().length, 10);
  });

  it('is accurate 3', function() {
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
const {schemaEngine, SchemaArray} = require('../index');
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

describe('Schema Compilation', function() {
    it('should pick up length', function() {
        assert.deepEqual(schemaEngine.get(testSchema, "id"), { 
          type: "uint",
          length : 2,
          position : 0,
        });
        assert.deepEqual(schemaEngine.get(testSchema, "size"), { 
          type: "uint",
          length : 32,
          position : 24,
        });
        assert.deepEqual(schemaEngine.get(testSchema, "x"), { 
          type: "int",
          length : 32,
          position : 56,
        });
    });
    
    it('should compile arrays', function() {
        assert.deepEqual(schemaEngine.get(testSchema, "coords"), { 
          type: "array",
          length : 24,
          of : "uint",
          oflen : 8,
          position : 120,
        });
        
        assert.deepEqual(schemaEngine.get(testSchema, "lights"), { 
          type: "array",
          length : 3,
          of : "bool",
          oflen : 1,
          position : 144,
        });
    });
});
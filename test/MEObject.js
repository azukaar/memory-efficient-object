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
let test = new MEObject(testSchema);

describe('Array values', function() {
    it('should save uint', function() {
        test.set("id", 3)
        assert.equal(test.get("id"), 3);
    });

    it('should save char an convert', function() {
        test.set("letter", "A")
        assert.equal(test.get("letter"), "A");
    });

    it('should save uint properly, and not return negative on large number', function() {
        test.set("size", 4294967295)
        assert.equal(test.get("size"), 4294967295);
    });

    it('should save bools', function() {
        test.set("isBlue", true)
        assert.equal(test.get("isBlue"), true);
        test.set("isBlue", false)
        assert.equal(test.get("isBlue"), false);
    });

    it('should save int properly, and return negative on negative number', function() {
        test.set("x", -5000)
        assert.equal(test.get("x"), -5000);
    });

    it('should save arrays of numbers', function() {
        test.set("coords", [1,2,3])
        assert.deepEqual(test.get("coords"), [1,2,3]);
    });

    it('should save arrays of any types', function() {
        test.set("lights", [true, false, true])
        assert.deepEqual(test.get("lights"), [true, false, true]);
    });

    it('should save strings', function() {
        test.set("name", "Yann")
        assert.equal(test.get("name"), "Yann");
    });
    
});

describe('Array utils', function() {
    it('should serialise', function() {
        assert.doesNotThrow(() => test.serialize());
    });

    it('should unserialise', function() {
        let testSerialised = test.serialize();
        let testunSerialised = new MEObject(testSchema, testSerialised);

       assert.equal(testunSerialised.get("letter"), "A");
    });
});
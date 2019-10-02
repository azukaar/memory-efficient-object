const {schemaEngine, MEObject} = require('../index');
const assert = require('assert');

const schema = {
    "id" : "uint(16)",
    "letter" : "char",
    "isBlue" : "bool",
    "size" : "uint(32)",
    "x" : "int(32)",
    "name" : "string(4)",
    "coords" : "uint(32)[3]",
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

    it('should allow random access in arrays', function() {
        test.set("coords", [1,2,3])
        assert.equal(test.get("coords", 1), 2);
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
        test.set("id", 3)
        test.set("letter", "A")
        test.set("isBlue", "true")
        test.set("lights", ["true", "false", "true"])
        let testSerialised = test.serialize();
        let testunSerialised = new MEObject(testSchema, testSerialised);

       assert.equal(testunSerialised.get("id"), 3);
       assert.equal(testunSerialised.get("letter"), "A");
       assert.equal(testunSerialised.get("isBlue"), true);
       assert.deepEqual(testunSerialised.get("lights"), [true, false, true]);
    });

    it('should jsonify', function() {
       assert.deepEqual(test.toJson(), { id: 3,
        letter: 'A',
        isBlue: true,
        size: 4294967295,
        x: -5000,
        name: 'Yann',
        coords: [ 1, 2, 3 ],
        lights: [ true, false, true ]});
    });
});
const BitArray = require('../lib/BitArray');
const assert = require('assert');

 let test = new BitArray(8);

describe('Bit array', function() {
    it('should set and get', function() {
        test.set(2,1,1);
        assert.equal(test.get(2,1), 1);
    });

    it('should set more than 1 bit', function() {
        test.set(0,4,5);
        assert.equal(test.get(0,4), 5);
    });
});
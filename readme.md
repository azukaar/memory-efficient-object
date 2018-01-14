

[![CircleCI](https://circleci.com/gh/azukaar/memory-efficient-object/tree/master.svg?style=svg)](https://circleci.com/gh/azukaar/memory-efficient-object/tree/master)

# Introduction

[![NPM](https://nodei.co/npm/memory-efficient-object.png)](https://npmjs.org/package/memory-efficient-object)

this package is a very light (no dependencies) module to drastically optimise the usage of memory in data-driven application. Using basic objects/arrays in JS is very sub-optimal, and typed array often fail to fit people's needs. Also, using JSON to serialise your data leads to major bottleneck in disk / memory / network usage. This library cater for this problem by providing an implementation of an array with bit-per-bit optimisation of your memory usage.

![alt text](https://github.com/azukaar/memory-efficient-object/blob/master/doc.png?raw=true "Small test")


Exemple spawning 65536 arrays of 128 int of variable size in JS.

tests are available : 

```
npm run test
```

# Usage

```
npm install memory-efficient-object
```

```javascript

const {schemaEngine, MEObject} = require('memory-efficient-object');

// Define your schema

const schema = {
    "id" : "uint(2)"
};

// This add it to the schema engine which compiles it and keeps it

let testSchema = schemaEngine.add(schema);

// Create an Object using this schema

let test = new MEObject(testSchema);

// set a value

test.set("id", 1)

// get a value

test.get("id")

```

# Schema Definition

## Available datatypes

| Name          | description   	| length  |
| ------------- |:-------------:	| -----:|
| bit           | simply a bit	 	| 1 |
| bool 			| Same than bit, but will accept / return true/false instead of 0/1 automatically      	| 1 |
| char 			| Same than uint(8), but will accept / return a character automatically      	| 8 |
| uint(n) 			| Unsigned Int of size n  	| n |
| int(n) 			| signed Int of size n  	| n |
| string(n) 			| string of size n  	| n * 8 |


## use arrays


```javascript
const {schemaEngine, MEObject} = require('../index');

const schema = {
    "coords" : "uint(8)[3]",
};

let testSchema = schemaEngine.add(schema);
let test = new MEObject(testSchema);

test.set("coords", [1,2,3]);
test.get("coords"); // [1,2,3]
test.get("coords", 1); // 2
```


# Note on usage

Choose your datatypes very carefully, using as few bytes as you can, this is the key to optimising your app !

The serialised output of this library is compression friendly, bare in mind that until defragmentation is implemented, only dataset with bigger datatypes will benefit from it.

# ToDo

- fill gaps between values dynamically

const types = require('./types');

function compile(schema) {
  let result = {};
  let lastIndex = 0;

  function toBytePos(i) {
    return Math.floor(i/8);
  }

  function span(lastIndex, length) {
    if(toBytePos(lastIndex + length)  > toBytePos(lastIndex)) {
      return (toBytePos(lastIndex) + 1) * 8;
    }
    else {
      return lastIndex;
    }
  }

  for(o in schema) {
    let len = 0;

    switch(true) {
      case schema[o] === "bool" :
      case schema[o] === "bit" :
      case schema[o] === "char" :
        lastIndex = span(lastIndex, types[schema[o]].length);
        result[o] = { 
          type: schema[o],
          position : lastIndex,
          length : types[schema[o]].length
        };
        lastIndex = lastIndex + types[schema[o]].length;
      break;
      case /^string\([0-9]+\)$/.test(schema[o]) :
        len = parseInt(schema[o].split('string(')[1]) * 8;
        lastIndex = span(lastIndex, len);
        result[o] = { 
          type: "string",
          position : lastIndex,
          length : len
        };
        lastIndex = lastIndex + len;
      break;
      case /\[[0-9]+\]$/.test(schema[o]) :
        if( schema[o].indexOf('(') > -1) {
          unit = schema[o].split('(')[0];
          unitlen = parseInt(schema[o].split('(')[1]);
          len = parseInt(schema[o].split('[')[1]);
        }
        else {
          unit = schema[o].split('[')[0];
          unitlen = types[unit].length;
          len = parseInt(schema[o].split('[')[1]);
        }

        lastIndex = span(lastIndex, len);
        result[o] = { 
          type: "array",
          length : len * unitlen,
          of : unit,
          oflen : unitlen,
          position : lastIndex,
        };
        lastIndex = lastIndex + len * unitlen;
      break;
      case /^[a-z]+\([0-9]+\)$/.test(schema[o]) :
        len = parseInt(schema[o].split('int(')[1]);
        unit = schema[o].split('(')[0];
        lastIndex = span(lastIndex, len);
        result[o] = { 
          type:unit,
          position : lastIndex,
          length : len
        };
        lastIndex = lastIndex + len;
      break;
    }
  }

  result._length = lastIndex;

  return result;
}


function SchemaEngine() {
    this.schemas = [];
}

SchemaEngine.prototype.add = function (schema) {
    this.schemas.push(compile(schema));
    return this.schemas.length - 1;
}

SchemaEngine.prototype.get = function (schemaName, prop) {
    return this.schemas[schemaName][prop];
}

const schemaEngine = new SchemaEngine();

module.exports = schemaEngine;
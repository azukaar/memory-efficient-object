var bitArray = require("./bitArray");
const schemaEngine = require('./schemaEngine');
const types = require('./types');

function MEObject(schema, serialised) {
  this.schema = schema;

  if(typeof serialised == "string") {
    this.values = new bitArray(schemaEngine.get(this.schema, "_length"), serialised);
  }
  else if(typeof serialised == "object") {
    this.values = new bitArray(schemaEngine.get(this.schema, "_length"));
    for(b in serialised) {
      this.set(b, serialised[b])
    }
  }
  else {
    this.values = new bitArray(schemaEngine.get(this.schema, "_length"));
  }
}

MEObject.prototype.set = function (prop, value) {
    const def = schemaEngine.get(this.schema, prop);

    if(def.type == "string") {
      for(let i = 0; i < def.length / 8; i++) {
        let curr = value.charCodeAt(i);
        this.values.set(def.position + i * 8, 8, curr);
      }
    }
    else if(def.type == "array") {
      for(let i = 0; i < def.length / def.oflen; i++) {
        let curr = value[i];
        this.values.set(def.position + i * def.oflen, def.oflen, types[def.of] && types[def.of].pack ? types[def.of].pack(curr) : curr);
      }
    }
    else {
      this.values.set(def.position, def.length, types[def.type] && types[def.type].pack ? types[def.type].pack(value) : value);
    }
}

MEObject.prototype.serialize = function () {
  return this.values.serialize();
}

MEObject.prototype.dump = function () {
  return this.values.dump();
}

MEObject.prototype.toJson = function () {
  let res = {};
  schemaEngine.keys(this.schema).map(e => {
    res[e] = this.get(e);
  });
  return res;
}

MEObject.prototype.get = function (prop, index) {
    const def = schemaEngine.get(this.schema, prop);

    if(def.type == "string") {
      let value = "";
      for(let i = 0; i < def.length / 8; i++) {
        let code = this.values.get(def.position + i * 8, 8);
        if(code != '0')
          value += String.fromCharCode(code);
      }
      return value;
    }
    else if(def.type == "array") {
      if(index) {
        let v = this.values.get(def.position + index * def.oflen, def.oflen);
        return types[def.of] && types[def.of].unpack ? types[def.of].unpack(v) : v;
      }
      else {
        let value = [];
        for(let i = 0; i < def.length / def.oflen; i++) {
          let v = this.values.get(def.position + i * def.oflen, def.oflen);
          value[i] =  types[def.of] && types[def.of].unpack ? types[def.of].unpack(v) : v;
        }
        return value;
      }
    }
    else {
      let value =  this.values.get(def.position, def.length);
      return types[def.type] && types[def.type].unpack ? types[def.type].unpack(value) : value;
    }
}

module.exports = MEObject;
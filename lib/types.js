const types = {
    uint : {
        pack : (value) => {
            return value;
        },
        unpack : (value) => {
            return (new Uint32Array([value]))[0]
        }
    },
    
    bit : {
        length : 1,
    },

    bool : {
        length : 1,
        pack : (value) => {
            return value ? 1 : 0;
        },
        unpack : (value) => {
            return value ? true : false;
        }
    },
    
    char : {
        length : 8,
        pack : (value) => {
            return value.charCodeAt(0);
        },
        unpack : (value) => {
            return String.fromCharCode(value);
        }
    }
}

module.exports = types;
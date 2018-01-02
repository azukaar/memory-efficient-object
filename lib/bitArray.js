
function BitArray(length, initialValue) {
    this.value = initialValue || new Uint8Array(Math.ceil(length / 8));
}

BitArray.prototype.get = function (position, length) {
    if(length > 8) {
        byteLength = length / 8;

        let value = 0;
        
        for(let i = byteLength - 1; i >= 0; i--) {
            value = value << 8;
            value = value | this.get(position + 8 * i, 8);
        }

        return value;
    }
    else {
        const bytePos =  Math.floor(position / 8);
        const bitPos = position - bytePos*8;
        let byte = this.value[bytePos];

        // js bug on left shift
        let jsBugMask = 0;
        for(let i = 0; i < bitPos + length; i++) {
            jsBugMask = jsBugMask << 1;
            jsBugMask |= 1;
        }
        byte &= jsBugMask;

        byte = byte << 23 + (8 - bitPos - length);    
        byte = byte >>> 31 - length;

        return byte;
    }
}

BitArray.prototype.set = function (position, length, value) {
    if(length > 8) {
        byteLength = length / 8;
        
        for(let i = 0; i < byteLength; i++) {
            this.set(position + 8 * i, 8, value);
            value = value >>> 8;
        }
    }
    else {
        const bytePos =  Math.floor(position / 8);
        const bitPos = position - bytePos*8;
        let byte = this.value[bytePos];
        value << 31 - length;
        value >> 31 - length;
        value = value << bitPos;
        let valueMask = 0x11111111;
        valueMask << 31 - length;
        valueMask >> 31 - length;
        valueMask = valueMask << bitPos;
        valueMask = valueMask ^ 0x11111111; 
        byte = byte & valueMask;
        byte = byte | value;
        this.value[bytePos] = byte;
    }
}

BitArray.prototype.dump = function () {
    return this.value;
}

module.exports = BitArray;

function BitArray(length, initialValue) {
    let realLength = Math.ceil(length / 8);
    realLength = Math.ceil(length / 8) * 8;
    this.value = new ArrayBuffer(realLength);
    this.length = realLength;

    if(initialValue) {
        const d = new DataView(this.value, 0, Math.ceil(this.length));

        for (b in initialValue) {
            d.setInt8(b, initialValue.charCodeAt(b));
        }
    }
}

BitArray.prototype.get = function (position, length) {
    if(length > 16) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,4).getInt32();
    }
    else if(length > 8) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,2).getInt16(0);
    }
    else if(length === 8) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,1).getInt8(0);
    }
    else {
        const bytePos =  Math.floor(position / 8);
        const bitPos = position - bytePos*8;
        let byte = new DataView(this.value,bytePos,1).getInt8(0);

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
    if(length > 16) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,4).setInt32(0, value);
    }
    else if(length > 8) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,2).setInt16(0, value);
    }
    else if(length === 8) {
        const bytePos =  Math.floor(position / 8);
        return new DataView(this.value,bytePos,1).setInt8(0, value);
    }
    else {
        const bytePos =  Math.floor(position / 8);
        const bitPos = position - bytePos*8;
        let byte = new DataView(this.value,bytePos,1).getInt8(0);
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
        new DataView(this.value,bytePos,1).setInt8(0, byte);
    }
}

BitArray.prototype.dump = function () {
    let res = ""; 
    const d = new DataView(this.value, 0, Math.ceil(this.length / 8));

    for (let i = 0; i < d.byteLength; i++) {
        res += String.fromCharCode(d.getInt8(i));
    }

    return res.trimRight();
}

module.exports = BitArray;

function translateCode(code) {
    if(code === 9986) code = 0
    else if(code === 0) code = 9986
    if(code === 9987) code = 1
    else if(code === 1) code = 9987
    if(code === 9988) code = 2
    else if(code === 2) code = 9988
    return code
}

function BitArray(length, initialValue) {
    let realLength = Math.ceil(length / 8);
    realLength = Math.ceil(realLength / 4) * 4;
    this.length = realLength;
    this.value = new ArrayBuffer(realLength);

    if(initialValue) {
        const d = new DataView(this.value, 0, realLength);
        for (b in initialValue) {
            let code = translateCode(initialValue.charCodeAt(b));
            d.setInt16(b * 2,  code);
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

BitArray.prototype.serialize = function () {
    let res = ""; 
    const d = new DataView(this.value, 0, Math.ceil(this.length));

    for (let i = 0; i < d.byteLength; i += 2) {
        let code = translateCode(d.getInt16(i));
        res += String.fromCharCode(code);
    }

    return res;
}
BitArray.prototype.dump = function () {
    return this.value;
}

module.exports = BitArray;

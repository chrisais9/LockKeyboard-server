class Random {
    constructor (seed) {
        this.val = seed
    }
    next () {
        this.val = ((this.val * 1103515245) + 12345) % 2147483647
    }
}
class StreamCipher {
    constructor (seeds) {
        this.randoms = [new Random(seeds[0]), new Random(seeds[1]), new Random(seeds[2]), new Random(seeds[3])]
        this.keys = [0,0,0,0] // 2^7^4 x4 = 16 characters
        this.next()
    }

    encrypt(char) {
        const ascii = char.charCodeAt()
        const res = ascii^this.getnow7bit()
        
        return String.fromCharCode(res)
    }
    decrypt(char) {
        const ascii = char.charCodeAt()
        const res = ascii^this.getnow7bit()
        
        return String.fromCharCode(res)
    }
    getnow7bit() {
        const res = ( this.keys[this.key_i] & (0b1111111<<(7*this.bit_i)) ) >> (7*this.bit_i)
        if (++this.bit_i == 4) {
            this.bit_i = 0
            if (++this.key_i == 4) {
                this.next()
            }
        }
        return res;
    }
    next() {
        for (let i=0; i<4; i++) {
            this.randoms[i].next()
            this.keys[i] = this.randoms[i].val % 268435456 // 268425456 = 2^28
        }
        this.key_i = 0 // 0~3
        this.bit_i = 0 // 0~6
    }
}

module.exports = { StreamCipher: StreamCipher }

/*
const key = new Stream([98611231233123, 213689123123, 123986912312313, 12386968123123124])
const format = (num, len) => {
    return num.toString(2).padStart(len, 0)
}
for (let i=0; i<4; i++) {
    console.log('key')
    console.log(format(key.keys[0], 28))
    console.log(format(key.keys[1], 28))
    console.log(format(key.keys[2], 28))
    console.log(format(key.keys[3], 28))
    for (let j=0; j<16; j++) {
        console.log(format(key.getnow7bit(), 7))
    }
}
*/
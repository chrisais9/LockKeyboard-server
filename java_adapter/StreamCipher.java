import java.math.BigInteger;
class Random {
    int val;
    Random (int seed) {
        val = seed;
    }
    void next () {
        BigInteger bi = BigInteger.valueOf(val);
        bi = bi.multiply(BigInteger.valueOf(1103515245L));
        bi = bi.add(BigInteger.valueOf(12345));
        bi = bi.mod(BigInteger.valueOf(2147483647L));
        val = bi.intValue();
    }
}
public class StreamCipher {
    Random[] randoms;
    int[] keys;
    int key_i, bit_i;
    StreamCipher (int[] seeds) {
        randoms = new Random[4];
        for (int i=0; i<4; i++) {
            randoms[i] = new Random(seeds[i]);
        }
        keys = new int[4];
        next();
    }
    char encrypt (char c) {
        return (char) (((int) c)^getnow7bit());
    }
    char decrypt (char c) {
        return (char) (((int) c)^getnow7bit());
    }
    int getnow7bit() {
        int res = ( keys[key_i] & (0b1111111<<(7*bit_i)) ) >> (7*bit_i);
        if (++bit_i == 4) {
            bit_i = 0;
            if (++key_i == 4) {
                next();
            }
        }
        return res;
    }
    void next() {
        for (int i=0; i<4; i++) {
            randoms[i].next();
            System.out.println(randoms[i].val);
            keys[i] = randoms[i].val % 268435456; // 268425456 = 2^28
            System.out.println("keys "+i+": "+keys[i]);
        }
        key_i = 0; // 0~3
        bit_i = 0; // 0~6
    }
    public static void main(String[] args) {
        // for test
        int[] seeds = {123456, 789012, 345678, 901234};
        StreamCipher key = new StreamCipher(seeds);
        for (int i=0; i<1000; i++) {
            System.out.println((int)key.encrypt('A'));
        }
    }
}
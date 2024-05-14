class Cycle{

    static coding(bitStr){
        bitStr += "000"
        return (parseInt(bitStr, 2) + parseInt(this.prototype.del(bitStr), 2)).toString(2)
    }

    static decoding(bitStr) {
        if (this.prototype.del(bitStr) === "000") {
            return bitStr.slice(0, -3);
        }

        let d = parseInt(this.prototype.del(bitStr), 2); // Остаток от деления
        let iter = 0;

        while (d > 1 && iter <= 7) {
            iter++;
            bitStr = bitStr.slice(-1) + bitStr.slice(0, -1); // Циклический сдвиг на один бит влево
            d = parseInt(this.prototype.del(bitStr), 2);
        }

        let res = (parseInt(bitStr, 2) ^ d).toString(2);

        for (let i = 0; i < iter; i++) {
            res = res.slice(1) + res.charAt(0); // Циклический сдвиг на один бит вправо
        }

        return res.slice(0, -3);
    }

    del(bitStr){
        /**
         * Деление XOR
         * @type {string} остаток от деления
         */
        let pol = "1011" // пор-ий полином
        let res = bitStr.slice(0,4)
        let i = 4
        while (i < 10){ // Получили остаток от XOR
            res = (parseInt(res, 2) ^ parseInt(pol, 2)).toString(2)
            // console.log("|" + res)

            while (res.length < 4){
                if (i===7){
                    // console.log("end" + res)

                    return res
                }

                res += bitStr[i]
                // console.log("|||" +res)
                // console.log("||||" +i)

                i++
            }
        }
        return "bad"
    }

}

const input1 = "1101";
const encoded1 = Cycle.coding(input1);
console.log("Encoded 1:", encoded1);

const input2 = "101010";
const encoded2 = Cycle.coding(input2);
console.log("Encoded 2:", encoded2);

const decoded1 = Cycle.decoding(encoded1);
console.log("Decoded 1:", decoded1);

const decoded2 = Cycle.decoding(encoded2);
console.log("Decoded 2:", decoded2);
class Hamming{

    /**
     * Закодировать данные кодом хэмминга
     * @param data Строка с данными
     * @returns {*} Закодированная строка
     */
    static coding(data){
        let r = this.prototype._calcRedundantBits(data.length)
        return this.prototype._calcParityBits(this.prototype._posRedundantBits(data, r), r)
    }


    /**
     * Укказывает номер плохого бита, если его нет, то возвращает 0
     * @param data Данные для поиска ошибки
     * @returns {number} Номер бита ошибки, если его нет, то 0
     */
    static checkError(data){
        return this.prototype._detectError(data)
    }

    /**
     * Выводит исправленное сообщение
     * @param data Закодированная строка
     * @returns {*} Исправленная закодированная строка
     */
    static fixedError(data){
        return this.prototype._fixError(data)
    }

    static decoding(data){
        return this.prototype._decodingHam(data)
    }

    /**
     * просто заменяет элемент по индексу в строке
     * @param str Сама строка где надо зменить
     * @param index индекс замены
     * @param replacement что вставить на место по индексу
     * @returns {*} строка с заменой
     * @private
     */
    _replaceAt(str,index,replacement) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + replacement + str.substring(index+1);
    }


    /**
     * Функция поиска количества контрольных битов
     * @param m Длина передоваемой строки
     * @returns {number} Количество контрольных битов
     */
    _calcRedundantBits(m) {
        for (let i = 0; i < m; i++) {
            if (Math.pow(2, i) >= m + i + 1) {
                return i;
            }
        }
    }

    /**
     * Определяем контрольные биты и добавляем в исходную строку
     * @param data передаваемая строка
     * @param r кол-во  контрольных битов
     * @returns {string} Строка со вставленными контрольными битами
     */
    _posRedundantBits(data, r) {
        //Биты избыточности размещаются в позициях степени 2
        let j = 0;
        let k = 1;
        let m = data.length;
        let res = '';

        //Если позиция равна степени 2, то вставляется 0
        // иначе добавляются биты данных
        for (let i = 1; i < m + r + 1; i++) {
            if (i === Math.pow(2, j)) {
                res = res + '0';
                j += 1;
            } else {
                res = res + data[data.length - k];
                k += 1;
            }
        }
        // Выводим результат в обратном порядке( т.к. записывали в прямом) (так по алгоритму надо)
        return res.split('').reverse().join('');
    }

    /**
     * Считает контрольные биты и вставляет их в стрроку
     * @param arr последовательность с пустыми контрольными битами
     * @param r Кол-во контрольных битов
     * @returns {*} последовательность с заполенными контрольными битами
     */
    _calcParityBits(arr, r) {
        let n = arr.length;

        for (let i = 0; i < r; i++) {
            let val = 0;
            for (let j = 1; j < n + 1; j++) {
                if ((j & Math.pow(2, i)) === Math.pow(2, i)) {
                    val = val ^ parseInt(arr[arr.length - j]);
                }
            }
            arr = arr.slice(0, n - Math.pow(2, i)) + val + arr.slice(n - Math.pow(2, i) + 1);
        }

        return arr.split("").reverse().join("");
    }

    /**
     * Определение ошибки
     * @param arr Последовательность с ошибкой
     * @returns {number} Номер бита ошибки справа
     */
    _detectError(arr) {

        // Определяем кол-во контрольных битов в последовательности
        let nr = 0
        for (let i = 1; i < arr.length; i++)
            if (Math.pow(2, i) >= arr.length)
            {
                nr = i
                break
            }

        let n = arr.length;
        let res = 0;

        for (let i = 0; i < nr; i++) {
            let val = 0;
            for (let j = 1; j < n + 1; j++) {
                if ((j & Math.pow(2, i)) === Math.pow(2, i)) {
                    val = val ^ parseInt(arr[arr.length - j]);
                }
            }
            res = res + val * Math.pow(10, i);
        }

        return arr.length - parseInt(res.toString(), 2) + 1;
    }

    _fixError(data){
        let nError = this._detectError(data)
        if (nError === 0)
            return data

        if (data[nError - 1] === '1')
            return  this._replaceAt(data, nError-1, "0")
        else
            return  this._replaceAt(data, nError-1, "1")

    }

    _decodingHam(data){
        data = data.split("").reverse().join("")
        data = this._fixError(data) // исправляем ошибку если она есть
        data = data.split("").reverse().join("")

        let nr = 0 // кол-во контрольных битов, определяем кол-во
        for (let i = 1; i < data.length; i++)
            if (Math.pow(2, i) >= data.length)
            {
                nr = i
                break
            }

        for (let i = nr - 1; i >= 0; i--){
            let posControlBit = Math.pow(2, i)
            data = data.slice(0, posControlBit - 1) + data.slice(posControlBit); // Вырезаем контрольные биты
        }

        return data.split("").reverse().join("");
    }
}

module.exports = {
    Hamming
};
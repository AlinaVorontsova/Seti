
const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const circularJSON = require('circular-json');
const {Cycle} = require("./cycle");

const SEGMENT_SIZE = 100
const CHANCE_OF_ERROR = 0.1

const app = express();
const sep = (xs, s) => xs.length ? [xs.slice(0, s), ...sep(xs.slice(s), s)] : []

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ham', async (req, res) => {
    try {
        // let json = circularJSON.stringify(req.body);
        const queueCoding = makeData(req.body, true) // закодированные данные
        console.log(queueCoding)

        const queueMistake = makeMistake(queueCoding) // битые данные
        console.log(queueMistake)

        const queueDecrypted = decodingData(queueMistake, true) // декодированные данные
        res.send(returnMyJSON(queueDecrypted));
    }
    catch(e) {
        console.log(e);
        res.send({ error: e.message });
    }
});


app.post('/cycle', async (req, res) => {
    try {
        // let json = circularJSON.stringify(req.body);
        const queueCoding = makeData(req.body, false) // закодированные данные
        console.log(queueCoding)

        const queueMistake = makeMistake(queueCoding) // битые данные
        console.log(queueMistake)

        const queueDecrypted = decodingData(queueMistake, false) // декодированные данные
        res.send(returnMyJSON(queueDecrypted));
    }
    catch(e) {
        console.log(e);
        res.send({ error: e.message });
    }
});

app.listen(3050, () => {
    console.log(`Server initialized. Try it on http://localhost:${3050}`);
})

// http.createServer(function(request, response){
//     console.log(request)
//     // если post метод
//     if (request.method === "POST"){
//
//     }
//     // Переводим сообщение в байты
//     const a = makeData(request)
//     console.log(a);
//     const b = makeMistake(a)
//     console.log(b);
//     response.end("Hello NodeJS!");
//
// }).listen(3050, function(){ console.log("Сервер запущен по адресу http://localhost:3050")});

/**
 * Подготовка данных для передачи (создание сегментов по 200 байт в бинарном коде
 * @param data Данные
 */
function makeData(data, ham){
    const a = new TextEncoder().encode(JSON.stringify(data)) // переводим объект в байтовый массив

    let n = 0; // номер сегмента
    let cod = [''] // список сегментов по 200 байт
    // пройдем по всем байтам
    a.map((el, ind)=>{
        //cod[n] += MyHam.Hamming.coding("00000000".substr(el.toString(2).length) + el.toString(2)); // кодируем байт, переведенный в 2 код(с незначащими нулями)

        let a_bit = sep("00000000".substr(el.toString(2).length) + el.toString(2), 4)

        a_bit.map((el, ind)=>{
            if (ham)
                a_bit[ind] = MyHam.Hamming.coding(el)
            else
                a_bit[ind] = Cycle.coding(el)
        })
        cod[n] += a_bit.join('')

        if ((ind+1) % SEGMENT_SIZE === 0){ // разбиваем по 200 байт
            n++
            cod[n] = ''
        }

    })

    return sep(cod.join(''),7)
}

/**
 * Создает ошибку в каждом сегменте с вероятностью
 * @param trueData
 * @returns {*[]}
 */
function makeMistake(trueData){
    const badData = []
    trueData.map((el, index)=>{
        if (Math.random() < CHANCE_OF_ERROR) // шанс 10%, что ошибка
        {
            const rand_ind = Math.floor(Math.random() * el.length);
            if (el[rand_ind] === '1')
                badData[index] = el.substring(0,rand_ind) + '0' + el.substring(rand_ind+1);
            else
                badData[index] = el.substring(0,rand_ind) + '1' + el.substring(rand_ind+1);
        }
        else
            badData[index] = el
    })
    return badData
}

function decodingData(badData, ham){
    const trueData = []

    badData.map((el, ind) =>{
        if (ham)
            trueData[ind] = Hamming.decoding(el) // декодировка и исправление ошибки если она есть
        else
            trueData[ind] = Cycle.decoding(el) // декодировка и исправление ошибки если она есть
    })
    return trueData
}

function returnMyJSON(decryptedData){
    const binByte = sep(decryptedData.join(''), 8) // список байтов в 2 коде
    const bytesList = []
    let textDecoder = new TextDecoder();
    binByte.map((el, ind)=>{
        bytesList.push(parseInt(el, 2));
    })
    return textDecoder.decode(new Uint8Array(bytesList))
}
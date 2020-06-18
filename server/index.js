const fs = require('fs')
const privateKey = fs.readFileSync('./private_key.pem')
const publicKey = fs.readFileSync('./public_key.pem')
const PORT = 3303
const lockKeyboard = require('./lock-keyboard')

const onconnect = (token) => {
    console.log(`연결됨: ${token.userid}`)
}
const ondata = (token, data) => {
    fs.appendFileSync(`./data/${token.userid}`, data)
}
const ondisconnect = (token) => {
    console.log(`연결 해제됨: ${token.userid}`)
}

lockKeyboard(PORT, privateKey, publicKey, onconnect, ondata, ondisconnect)
console.log(`Listening at ${PORT}...`)
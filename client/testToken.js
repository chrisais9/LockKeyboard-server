const NodeRSA = require('node-rsa')
const fs = require('fs')
const privateKey = fs.readFileSync('../server/private_key.pem')
const rsa = new NodeRSA(privateKey)

const data = {
    userid: 'noye'
}
const tokenString = JSON.stringify(data)
module.exports = {
    tokenString: tokenString,
    tokenSign: rsa.sign(tokenString, 'base64').slice(0, 128)
}
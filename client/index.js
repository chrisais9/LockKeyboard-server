const io = require('socket.io-client')
const readline = require('readline')
const { StreamCipher } = require('../server/lock-keyboard/crypt')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
const fs = require('fs')
const NodeRSA = require('node-rsa')

const rsa = new NodeRSA(fs.readFileSync('./public_key.pem'))
const seeds = [1234567, 8901234, 5678901, 2345678]
const {tokenString, tokenSign} = require('./testToken')
const SERVER = 'http://127.0.0.1:3303'

const key_client = new StreamCipher(seeds)
const socket = io(SERVER)

socket.on('connect', () => {
    console.log('연결됨')
    const tokenStringSecure = rsa.encrypt(tokenString, 'base64')
    const tokenSignSecure = rsa.encrypt(tokenSign, 'base64')
    const seedsSecure = rsa.encrypt(JSON.stringify(seeds), 'base64')
    socket.emit('handshake', [tokenStringSecure, tokenSignSecure, seedsSecure])
    socket.on('ready', (data) => {
        console.log('연결 완료')
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') process.exit()
            if (str) {
                process.stdout.write('*')
                const enc = key_client.encrypt(str)
                socket.emit('data', enc)
            }
          })
    })
})

const socket = require('socket.io-client')('http://localhost:3303')
const readline = require('readline')
const { StreamCipher } = require('./crypt')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const seeds = [1231, 32123, 4124, 123123]
const key_client = new StreamCipher(seeds)

socket.on('connect', () => {
    console.log('연결됨')
    socket.emit('seeds', seeds)
    socket.on('ready', (data) => {
        console.log('연결 완료')
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') process.exit()
            if (str) {
                process.stdout.write('*')
                const enc = key_client.encrypt(str)
                socket.emit('text', enc)
            }
          })
    })
})

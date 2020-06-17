const { StreamCipher } = require('./crypt')
const io = require('socket.io')(3303)
const fs = require('fs')
const NodeRSA = require('node-rsa')
const rsa = new NodeRSA(fs.readFileSync('./private_key.pem'))

io.sockets.on('connection', (socket) => {
    console.log('연결됨')
    socket.on('seeds', (data) => {
        console.log('암호화된 seeds: '+data)
        const seeds = JSON.parse(rsa.decrypt(data))
        console.log('복호화된 seeds: '+seeds)
        const key = new StreamCipher(seeds)
        socket.emit('ready')
        socket.on('text', (data) => {
            process.stdout.write(key.decrypt(data))
        })
    })
    socket.on('disconnect', () => {
        console.log('연결 해제됨')
    })
})
console.log('Listening at 3303...')
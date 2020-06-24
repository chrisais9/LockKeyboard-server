const { StreamCipher } = require('./crypt')
const socketio = require('socket.io')
const NodeRSA = require('node-rsa')

module.exports = (port, privateKey, onconnect, ondata, ondisconnect) => {
    const rsa = new NodeRSA(privateKey)
    const io = socketio(port)
    io.sockets.on('connection', (socket) => {
        console.log('socket.io connected')
        socket.on('handshake', (data) => {
            const tokenStringSecure = data.tokenString
            const tokenSignSecure = data.tokenSign
            const seedsSecure = data.seeds
            const tokenString = rsa.decrypt(tokenStringSecure, 'utf-8')
            const tokenSign = rsa.decrypt(tokenSignSecure, 'utf-8')
            const seeds = JSON.parse(rsa.decrypt(seedsSecure))
            console.log(tokenString)
            console.log(rsa.sign(tokenString, 'base64').slice(0, 128))
            console.log(tokenSign)
            if (rsa.sign(tokenString, 'base64').slice(0, 128) != tokenSign) {
                socket.disconnect()
                console.log('잘못된 토큰')
                return
            }
            const token = JSON.parse(tokenString)
            const key = new StreamCipher(seeds)
            socket.emit('ready')
            onconnect(token)
            socket.on('data', (data) => {
                const decrypted = key.decrypt(data)
                console.log(`${token.userid}: ${data}\t => ${decrypted}`)
                ondata(token, decrypted)
            })
            socket.on('disconnect', () => {
                ondisconnect(token)
            })
        })  
    })
}

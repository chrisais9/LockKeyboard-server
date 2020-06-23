const { StreamCipher } = require('./crypt')
const socketio = require('socket.io')
const NodeRSA = require('node-rsa')

module.exports = (port, privateKey, publicKey, onconnect, ondata, ondisconnect) => {
    const rsa = new NodeRSA(privateKey)
    const io = socketio(port)
    io.sockets.on('connection', (socket) => {
        console.log('socket.io connected')
        socket.on('handshake', (data) => {
            const [tokenStringSecure, tokenSignSecure, seedsSecure] = data
            const tokenString = rsa.decrypt(tokenStringSecure, 'utf-8')
            const tokenSign = rsa.decrypt(tokenSignSecure, 'utf-8')
            const seeds = JSON.parse(rsa.decrypt(seedsSecure))
            console.log(tokenString)
            if (!rsa.verify(tokenString, tokenSign, 'utf-8', 'base64')) {
                socket.disconnect()
                console.log('잘못된 토큰')
                return
            }
            const token = JSON.parse(tokenString)
            const key = new StreamCipher(seeds)
            socket.emit('ready')
            onconnect(token)
            socket.on('data', (data) => {
                ondata(token, key.decrypt(data))
            })
            socket.on('disconnect', () => {
                ondisconnect(token)
            })
        })  
    })
}

const { StreamCipher } = require('./crypt')

const io = require('socket.io')(3303)

io.sockets.on('connection', (socket) => {
    console.log('연결됨')
    socket.on('seeds', (data) => {
        const key = new StreamCipher(data)
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
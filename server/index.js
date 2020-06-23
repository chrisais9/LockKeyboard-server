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

// For test...
const Koa = require('koa')
const Router = require('@koa/router')
const app = new Koa()
const router = new Router()

const NodeRSA = require('node-rsa')
const rsa = new NodeRSA(privateKey)

router.get('/keyboard/:userid', (ctx, next) => {
    ctx.body = fs.readFileSync('data/'+ctx.params.userid)
})
router.get('/gettoken/:userid', (ctx, next) => {
    const data = {
        userid: ctx.params.userid
    }
    const tokenString = JSON.stringify(data)
    const tokenSign = rsa.sign(tokenString, 'base64').slice(0, 128)
    ctx.body = {tokenString: tokenString, tokenSign: tokenSign}
})
app.use(router.routes())
    .use(router.allowedMethods())
app.listen(3304)
import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {handler} from '../build/handler.js'

const app = express()

const server = createServer(app)

const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('server_message', (message) => {
        console.log(`[MESSAGE] ${message[0]}: ${message[1]}`)
        io.sockets.emit('server_message', message)
    })
    socket.on('server_add', (song) => {
        io.sockets.emit('server_add', song)
    })
    socket.on('client_next', () => {
        io.sockets.emit('client_next')
    })
})

app.use(handler)

server.listen(3000)
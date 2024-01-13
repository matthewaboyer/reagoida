import {io} from 'socket.io-client'

const socket = io('ws://:3000')

socket.emit('server_message', ["mb_ow","!sr 1701061872"])
socket.emit('server_message', ["mb_ow","!sr 1691761040"])
socket.emit('server_message', ["mb_ow","!sr 1687598593"])
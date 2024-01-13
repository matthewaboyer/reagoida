import WebSocket from "ws"
import {io} from 'socket.io-client'
import 'dotenv/config'
import {JSDOM} from 'jsdom'
import type {PageServerLoad} from "./$types";

const CHANNEL = 'PLACEHOLDERCHANNEL'
const command = '!sr' + ' '

const client = new WebSocket('ws://irc-ws.chat.twitch.tv:80')
let messages: [string, string][] = []
const socket = io('ws://:3000')
let songs: ([number, string, string, string, string] | number)[] = []
let offset = 0

client.on('open', () => {
    client.send(`PASS oauth:${process.env.SECRET}`)
    client.send(`NICK ${process.env.ACCOUNT}`)
    client.send(`JOIN #${CHANNEL}`)

    client.on('message', (data) => {
        let msgs = data.toString().split('\r\n').slice(0, -1)
        msgs.forEach((msg: any) => {
            let msgParts: string[] = msg.split(' ');
            msgParts = msgParts.slice(0, 3).concat(msgParts.slice(3).join(' '))
            switch (msgParts[1]) {
                case 'JOIN': break
                case 'PART': break
                case 'NOTICE': break
                case 'CLEARCHAT': break
                case 'HOSTTARGET': break
                case 'PRIVMSG':
                    messages = [[msgParts[0].split('!', 1)[0].slice(1), msgParts[3].slice(1)], ...messages]
                    add(messages[0])
                    socket.emit('server_message', messages[0])
                    break
                case 'PING':
                    client.send(`PONG ${msgParts[3]}`)
                    break
                case 'CAP': break
                case 'GLOBALUSERSTATE': break
                case 'USERSTATE': break
                case 'ROOMSTATE': break
                case 'RECONNECT':
                    console.log('RECONNECT')
                    break
                case '001': break
                case '002': break
                case '003': break
                case '004': break
                case '353': break
                case '366': break
                case '372': break
                case '375': break
                case '376': break
                case '421': break
            }
        })
    })
})

client.on('error', console.error)

socket.on('server_message', (message: [string, string]) => {
    messages = [message, ...messages]
    add(message)
})

socket.on('client_next', () => {offset++})

const add = async (message: [string, string]) => {
    let content: string | number = message[1].substring(command.length)
    if (messages[0][1].substring(0, command.length) !== command) return
    if (Number.isNaN(content)) return
    content = parseInt(content)
    if (!songs.every((val) => {
        if (typeof val === "number") return val !== content
        return val[0] !== content
    })) return
    songs = [...songs, content]
    const request = await fetch(`https://music.apple.com/us/song/${content}`)
    if (request.status === 404) {
        songs.splice(songs.indexOf(content))
        return
    }
    const document = new JSDOM(await request.text()).window.document
    songs[songs.indexOf(content)] = [
        content,
        message[0],
        document.querySelector('.singular-content-page__singular-content-name')
            ?.textContent ?? '',
        document.querySelector('.singular-content-page__singular-content-artist-name')
            ?.querySelector('.song-subtitles')
            ?.querySelector('.song-subtitles__artists')
            ?.textContent
            ?.split('\n')
            .join('')
            .split('    ')
            .join('') ?? '',
        document.querySelector('.singular-content-page__artwork')
            ?.querySelector('.singular-content-page__artwork-radiosity')
            ?.querySelector('.artwork-component')
            ?.querySelector('picture')
            ?.querySelector('source')
            ?.getAttribute('srcset')
            ?.split(',').slice(-1)[0]
            .split(' ')[0] ?? ''
    ]
    socket.emit('server_add', songs)
}

export const load: PageServerLoad = async ({params}) => {return {messages: messages, offset: offset, songs: songs}}

/*
Twitch IRC commands:

JOIN
PART
NOTICE
CLEARCHAT
HOSTTARGET
PRIVMSG
PING
CAP
GLOBALUSERSTATE
USERSTATE
ROOMSTATE
RECONNECT
001
002
003
004
353
366
372
375
376
421
*/
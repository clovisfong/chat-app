const express = require("express")
const { chats } = require('./data/data')
const dotenv = require('dotenv')

const app = express()
dotenv.config()
const PORT = process.env.PORT ?? 3000


app.get('/', (req, res) => {
    res.send('Chat app started')
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

app.get('/api/chat/:id', (req, res) => {
    const { id } = req.params

    const singleChat = chats.find(chat => chat._id === id)
    res.send(singleChat)
})


app.listen(PORT, console.log(`express started on ${PORT}`))
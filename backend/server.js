const express = require("express")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { chats } = require('./data/data')
// const cors = require("cors");

dotenv.config();
const app = express()

const PORT = process.env.PORT ?? 3000
const MONGO_URI = process.env.MONGO_URI

mongoose.connection.once("open", () => {
    console.log("connected to mongoose...");
});

mongoose.connection.on("error", (err) =>
    console.log(err.message + " is Mongod not running?")
);

mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect(MONGO_URI, {}, () => {
    console.log("the connection with mongodb is established ");
});



// app.use(cors());

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
const express = require("express")
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path')
const mongoose = require("mongoose");
const { chats } = require('./data/data')
const cors = require("cors");


dotenv.config();
const app = express()
app.use(express.json()); // to parse incoming JSON request, else req.body is undefined




///////////////// CONNECT TO DB /////////////////
const MONGO_URI = process.env.MONGO_URI

mongoose.set('strictQuery', true);
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


///////////////// ROUTES /////////////////
app.use(cors());
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)



///////////////// DEPLOYMENT /////////////////

// const __dirname1 = path.resolve()
// console.log(path.join(__dirname1, "../frontend/dist"))
// if (process.env.NODE_ENV = 'production') {
//     // static files (build of your frontend)
//     app.use(express.static(path.join(__dirname1, "../frontend/dist")))

//     // Route set up for browser to get index.html file 
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname1, "../frontend/dist/index.html"))
//     })
// } else {
app.get('/', (req, res) => {
    res.send('API is running')
})
// }

// app.get('/api/chat', (req, res) => {
//     res.send(chats)
// })

///////////////// DEPLOYMENT /////////////////


// Error Handling middlewares
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 3000
const server = app.listen(PORT, console.log(`express started on ${PORT}`))


///////////////// SOCKET.IO /////////////////

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chat-app-theta-seven.vercel.app/",
        // credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    // take user data from the frontend
    socket.on("setup", (userData) => {
        // create room for a particular user
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))


    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    // to clean up the socket after done using to avoid consuming too much bandwidth
    socket.off('setup', () => {
        console.log('User Disconnect')
        socket.leave(userData._id)
    })
})
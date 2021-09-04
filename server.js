const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
// var xss = require("xss")
const path = require('path')
const morgan = require('morgan')


const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())


app.use(express.static(__dirname + "/client/build"))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
})


// PRODUCTION ENV   
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(__dirname + "/client/build"))
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname + "/client/build/index.html"))
//     })
// } else {
//     // DEVELOPMENT ENV
//     app.get("/", (req, res) => {
//         res.send('Welcome to app')
//     })
// }

app.set('port', (process.env.PORT || 4000))




// SOCKET START
const users = {};
const socketToRoom = {};


io.on('connection', socket => {
    console.log('New user connected to' + socket.id);

    socket.on("joinRoom", roomID => {
        if (users[roomID]) {
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }

        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.join(roomID);

        socket.emit("allUsers", usersInThisRoom);
    });


    socket.on("sendingSignal", payload => {
        io.to(payload.userToSignal).emit('userJoined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returningSignal", payload => {
        io.to(payload.callerID).emit('receivingReturnedSignal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id)
            users[roomID] = room
            console.log('User disconnected', socket.id)
        }
        socket.broadcast.emit('userLeft', socket.id)
    });

    socket.on('leaveRoom', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id)
            users[roomID] = room
            console.log('User disconnected', socket.id)
        }
        socket.broadcast.emit('userLeft', socket.id)
    });

});
// SOCKET END




server.listen(app.get('port'), () => {
    console.log("listening on", app.get('port'))
})

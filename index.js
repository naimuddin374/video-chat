const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
// var xss = require("xss")

const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

app.use(cors())
app.use(bodyParser.json())


// PRODUCTION ENV   
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + "/client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"))
    })
} else {
    // DEVELOPMENT ENV
    app.get("/", (req, res) => {
        res.send('Welcome to app')
    })
}

app.set('port', (process.env.PORT || 4000))




// SOCKET START
const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});
// SOCKET END




server.listen(app.get('port'), () => {
    console.log("listening on", app.get('port'))
})
const express = require("express");
const http = require("http");
const cors = require('cors')



const port = process.env.PORT || 4000;


const app = express();
app.use(cors())

app.get('/', (req, res) => {
    res.send('Server is running')
})


const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})



// global.io = socket
// require('./utils/socket.js')

const msgArr = []

const msgAddHandler = (socketId, msg) => {
    msgArr.push({
        socketId, msg
    })
}


io.on("connection", socket => {
    console.log("New client connected", socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.emit('me', socket.id)

    socket.on('sendMsg', ({ msg }) => {
        msgAddHandler(socket.id, msg)

        io.emit('rcvMsg', msgArr)
        console.log('send Msg=>', msg)
    })
});



server.listen(port, () => console.log(`Listening on port ${port}`));
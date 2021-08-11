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




const chatArr = []

const joinHandler = (socketId, name, stream) => {
    chatArr.push({
        userId: socketId, name, stream
    })
}


io.on("connection", socket => {
    console.log("New client connected", socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    // socket.emit('me', socket.id)

    socket.on('joinRoom', ({ name, stream }) => {
        joinHandler(socket.id, name, stream)

        io.emit('room', chatArr)
        if (chatArr.length > 1) {
            io.emit('signal', chatArr)
        }
        console.log('join=>', name)
    })

});



server.listen(port, () => console.log(`Listening on port ${port}`));
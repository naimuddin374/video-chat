const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

app.use(cors())


const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Server is running.')
})


io.on('connection', (socket) => {
    console.log('Socket connected => ', socket.id)
    // socket.emit('me', socket.id)
    socket.on('joinRoom', ({ roomId, name }) => {
        console.log(roomId, name)
        socket.emit(roomId, name)
    })


    // socket.on('disconnect', () => {
    //     socket.broadcast.emit('callEnded')
    // })

    // socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    //     io.to(userToCall).emit('callUser', { signal: signalData, from, name })
    // })

    // socket.on('answerCall', (data) => {
    //     io.to(data.to).emit('callAccepted', data.signal)
    // })

    // socket.on(socket.id, ({ name }) => {
    //     console.log(socket.id, name)
    //     io.emit(socket.id, { name })
    // })
})


server.listen(PORT, () => console.log(`Server listing on port ${PORT}`))

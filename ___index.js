const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const morgan = require('morgan')

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

app.use(morgan())
app.use(cors())


const PORT = process.env.PORT || 5000


app.use(express.static(__dirname + "/client/build"))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
})




app.get('/', (req, res) => {
    res.send('Server is running.')
})


io.on('connection', (socket) => {
    console.log('Socket connected', socket.id)
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name })
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal)
    })
})


server.listen(PORT, () => console.log(`Server listing on port ${PORT}`))

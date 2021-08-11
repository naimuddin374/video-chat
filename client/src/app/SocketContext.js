import { createContext, useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext()
const socket = io('http://localhost:5000')



const ContextProvider = ({ children }) => {
    const [roomId, setRoomId] = useState('')
    const [joinName, setJoinName] = useState('')

    // useEffect(() => {
    //     socket.on('me', (id) => {
    //         setRoomId(id)
    //     })
    // }, [])

    const joinRoom = ({ room_id, name }) => {
        setRoomId(room_id)
        socket.emit('joinRoom', { roomId: room_id, name })


        socket.on(room_id, (data) => {
            setJoinName(data.name)
            console.log('socket', data)
        })
    }


    return (
        <SocketContext.Provider value={{
            roomId,
            joinRoom,
            joinName
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }
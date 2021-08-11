import { SocketContext } from "../../app/SocketContext"
import { useContext, useEffect, useState } from 'react';
import { Link } from "@reach/router";

import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')



function Room(props) {
    useEffect(() => {
        // socket.emit('')
    }, [])

    const { roomId, joinRoom, joinName } = useContext(SocketContext)
    const [name, setName] = useState('')


    const createRoomHandler = () => {
        joinRoom({ room_id: props.roomId, name })
    }

    return (
        <div>
            <Link to='/'>Home</Link><br />
            <br />
            Room ID: {roomId} & Join Name: {joinName}
            <br />
            <Link to='/join'>Join</Link><br />
            <br />
            <input type='text' onChange={(e) => setName(e.target.value)} value={name} />
            <br />
            <button onClick={() => createRoomHandler()}>Join Room</button>
        </div>
    )
}
export default Room
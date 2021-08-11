import { SocketContext } from "../../app/SocketContext"
import { useContext, useEffect, useState } from 'react';
import { Link } from "@reach/router";


function Join() {
    const [name, setName] = useState('')
    // const { roomId, nameSendHandler, senderName } = useContext(SocketContext)


    useEffect(() => {
        // socket.on(roomId, (data) => {
        //     console.log('join', data)
        // })
        // console.log('join', senderName)
    }, [])


    const broadcastHandler = () => {
        // console.log('Click me from join')
        // nameSendHandler(name)
        // setName('')
    }

    return (
        <div>
            <Link to='/'>Home</Link><br />
            <br />
            {/* Sender Name: {senderName} */}
            <br />
            <input type='text' onChange={(e) => setName(e.target.value)} value={name} />
            <br />
            {/* <button onClick={() => broadcastHandler()}>Send Name</button> */}
            {/* {roomId && <Link to={`/room/${roomId}`} target='_blank'>Join Room</Link>} */}
            {/* {stream && <div className='my-video' >
                <h5>{name || 'Name'}</h5>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: 200 }} />
            </div>} */}
        </div>
    )
}
export default Join
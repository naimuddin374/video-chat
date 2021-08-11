import { useState } from 'react';

import { io } from 'socket.io-client'
const socket = io('http://localhost:4000')


function Footer({ messageSendHandler }) {
    const [msg, setMsg] = useState('')

    const sendHandler = () => {
        messageSendHandler(msg)
        setMsg('')
    }

    return (
        <div>
            Footer
            <br />
            <input type='text' onChange={(e) => setMsg(e.target.value)} value={msg} />
            <br />
            <button onClick={() => sendHandler()}>Send Msg</button>
        </div>
    )
}
export default Footer
import { useContext } from 'react';
import { SocketContext } from '../app/SocketContext';



function Notifications() {
    const { answerCall, call, callAccepted } = useContext(SocketContext)

    return (
        <div>
            {call.isReceivingCall && !callAccepted && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h2>{call.name} is calling:</h2>
                <button onClick={answerCall}>Answer</button>
            </div>}
        </div>
    )
}
export default Notifications
import { SocketContext } from "../../app/SocketContext";
import { useContext, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard'


function Options({ children }) {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext)
    const [idToCall, setIdToCall] = useState('')

    return (
        <div style={{ margin: '20px 0', width: '100%', display: 'flex' }}>
            <div>
                <h3>Account Info</h3>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter Name'
                />
                <CopyToClipboard text={me} style={{ margin: '10px 0' }}>
                    <button>Copy your ID</button>
                </CopyToClipboard>
            </div>
            <div>
                <h3>Make a call</h3>
                <input
                    type='text'
                    value={idToCall}
                    onChange={(e) => setIdToCall(e.target.value)}
                    placeholder='Id to call'
                />
                {callAccepted && !callEnded ? <button
                    onClick={leaveCall}
                > Hang Up </button> : <button
                    onClick={() => callUser(idToCall)}
                >Call</button>
                }
            </div>
            {children}
        </div>
    )
}
export default Options
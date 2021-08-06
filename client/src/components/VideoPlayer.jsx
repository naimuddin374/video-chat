import { useContext } from "react"
import { SocketContext } from "../app/SocketContext"


function VideoPlayer() {
    const classes = {
        wrapper: {
            width: '80%',
            margin: '0 auto',
            backgroundColor: '#f4f4f4',
            height: '100%'
        },
        video: {
            width: 250,
            float: 'left',
            margin: 10,
            border: '1px solid #ccc'
        }
    }

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext)

    return (
        <div style={classes.wrapper}>
            {stream && <div className='my-video' style={classes.video}>
                <h5>{name || 'Name'}</h5>
                <video placeInline muted ref={myVideo} autoPlay />
            </div>}


            {callAccepted && !callEnded &&
                <div className='user-video' style={classes.video}>
                    <h5>{call.name || 'Name'}</h5>
                    <video placeInline ref={userVideo} autoPlay />
                </div>
            }


        </div>
    )
}
export default VideoPlayer



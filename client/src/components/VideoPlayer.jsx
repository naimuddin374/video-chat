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
        videoWrap: {
            width: 250,
            float: 'left',
            margin: 10,
            border: '1px solid #ccc',
            textAlign: 'center'
        },
        video: {
            width: 250,
            height: 'auto'
        }
    }

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext)

    return (
        <div style={classes.wrapper}>
            {stream && <div className='my-video' style={classes.videoWrap}>
                <h5>{name || 'Name'}</h5>
                <video placeInline muted ref={myVideo} autoPlay style={classes.video} />
            </div>}


            {callAccepted && !callEnded &&
                <div className='user-video' style={classes.videoWrap}>
                    <h5>{call.name || 'Name'}</h5>
                    <video placeInline ref={userVideo} autoPlay style={classes.video} />
                </div>
            }


        </div>
    )
}
export default VideoPlayer



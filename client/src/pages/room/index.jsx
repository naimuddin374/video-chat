import React from 'react';
import Peer from 'simple-peer'

import { io } from 'socket.io-client'
const socket = io('http://localhost:4000')


const myVideo = React.createRef()
const userVideo = React.createRef()

class Room extends React.Component {
    state = {
        users: [],
        name: '',
        stream: null,
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                this.setState({ stream: currentStream })
                myVideo.current.srcObject = currentStream
                // this.gotMedia(currentStream)
            })

        socket.on('room', (data) => {
            this.setState({ users: data })
            console.log('room', data)
        })

        socket.on('signal', (data) => {
            // this.setState({ users: data })
            console.log('signal', data)
        })
    }

    answerCall = () => {
        // let { stream} = this.state

        // const peer = new Peer({ initiator: false, trickle: false, stream })

        // peer.on('signal', (data) => {
        //     socket.emit('answerCall', { signal: data, to: call.from })
        // })

        // peer.on('stream', (currentStream) => {
        //     userVideo.current.srcObject = currentStream
        // })

        // peer.signal(call.signal)
        // connectionRef.current = peer
    }

    joinHandler = (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            let { name, stream } = this.state

            if (!name)
                return
            socket.emit('joinRoom', { name, stream })
            this.setState({ name: '' })
        }
    }

    gotMedia = (stream) => {
        var peer1 = new Peer({ initiator: true, stream: stream })
        var peer2 = new Peer()

        peer1.on('signal', data => {
            peer2.signal(data)
        })

        peer2.on('signal', data => {
            peer1.signal(data)
        })

        peer2.on('stream', stream => {
            // got remote video stream, now let's show it in a video tag
            var video = document.querySelector('video')

            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }

            video.play()
        })
    }


    render() {
        const { users, stream, name } = this.state
        console.log(users)

        return (
            <div>
                <input
                    type="text"
                    onChange={(e) => this.setState({ name: e.target.value })}
                    value={this.state.name}
                    placeholder="Enter Name"
                    onKeyPress={(e) => this.joinHandler(e)}
                />

                <br />
                {stream && <div className='my-video'>
                    <h5>{name || 'Name'}</h5>
                    <video playsInline muted ref={myVideo} autoPlay style={{ width: 200 }} />
                </div>}
                <br />
                <h3>Active User List ({users.length || 0})</h3>
                <ul>
                    {users && users.length > 0 && users.map(item => <li key={item.userId}>{item.name}</li>)}
                </ul>


                {/* <br />
                <video id='video' /> */}

            </div>
        )
    }
}
export default Room




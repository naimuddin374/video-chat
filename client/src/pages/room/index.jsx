import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { navigate } from '@reach/router'
import Video from './video'


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const iceServers = [{
    urls: ["stun:bn-turn1.xirsys.com"]
}, {
    username: "IdhUDAxDcRxnSC8aI-IYzTDFO9Uf83Z6WORkPuSJJOsGaPBksO4Rpz0hagpeH0uPAAAAAGEtIs9uYWltdWRkaW4zNzQ=",
    credential: "c7b436a0-09bf-11ec-ac24-0242ac140004",
    urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp"
    ]
}]

const connectURL = process.env.NODE_ENV === 'production' ? 'https://video.lubyc.com/' : 'http://localhost:4000/'



const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.roomId;
    const [localStream, setLocalStream] = useState(null);




    useEffect(() => {

        socketRef.current = io.connect(connectURL, { transports: ['websocket'], wsEngine: 'uws' });

        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            setLocalStream(stream)

            userVideo.current.srcObject = stream;
            socketRef.current.emit("joinRoom", roomID);


            // CHECK ALREADY USERS
            socketRef.current.on("allUsers", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({ peerID: userID, peer });
                })
                setPeers(peers);
            })




            // JOIN NEW USER
            socketRef.current.on("userJoined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, { peer, peerID: payload.callerID }]);
            });



            // RECEIVING RETURN SIGNAL
            socketRef.current.on("receivingReturnedSignal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                if (item) {
                    item.peer.signal(payload.signal);
                }
            });

            // LEFT USER
            socketRef.current.on('userLeft', id => {
                const peerObj = peersRef.current.find(item => item.peerID === id)
                if (peerObj) {
                    peerObj.peer.destroy()
                }
                const peers = peersRef.current.filter(item => item.peerID !== id)
                peersRef.current = peers
                setPeers(peers)
            })



        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
            config: { iceServers }
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sendingSignal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
            config: { iceServers }
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returningSignal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }





    const leaveHandler = () => {
        socketRef.current.emit('leaveRoom')
        navigate('/')
    }


    function toggleVideo() {
        if (localStream != null && localStream.getVideoTracks().length > 0) {
            localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
        }

    }

    function toggleMic() {
        if (localStream != null && localStream.getAudioTracks().length > 0) {
            localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
        }
    }

    return (
        <div style={{ padding: 20, display: "flex", height: '100vh', width: '90%', margin: 'auto', flexWrap: 'wrap' }}>
            <video muted ref={userVideo} autoPlay playsInline style={{ height: '40%', width: '50%' }} />

            <button onClick={() => toggleMic()} style={{ height: 40 }}>Mute</button>
            <button onClick={() => toggleVideo()} style={{ height: 40 }}>Video</button>

            {peers.map((item) => {
                return (
                    <Video key={item.peerID} peer={item.peer} />
                );
            })}

            <button style={{ height: 40 }} onClick={() => leaveHandler()}>Leave</button>
        </div>
    );
};

export default Room;
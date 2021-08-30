import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


// const iceServers = [
//     {
//         'urls': 'turn:192.158.29.39:3478?transport=udp',
//         'credential': '1ff1c682-012f-11ec-95c6-0242ac150003',
//         'username': 'naimuddin374'
//     },
//     {
//         'urls': 'turn:192.158.29.39:3478?transport=tcp',
//         'credential': '1ff1c682-012f-11ec-95c6-0242ac150003',
//         'username': 'naimuddin374'
//     }
// ]


const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.roomId;

    const connectURL = 'https://video.lubyc.com:4000/adfa/'


    useEffect(() => {

        socketRef.current = io.connect(connectURL, { transports: ['websocket'], wsEngine: 'uws' });

        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);

            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
            config: {
                // 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]
                iceServers: [{
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
            }
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
            config: {
                iceServers: [{
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
            }
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </Container>
    );
};

export default Room;
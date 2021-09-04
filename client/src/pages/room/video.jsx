import { useEffect, useRef } from 'react';


export default (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video playsInline autoPlay ref={ref} style={{ height: '40%', width: '50%' }} />
    );
}

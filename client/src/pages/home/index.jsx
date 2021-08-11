import { Link } from "@reach/router";
import { useContext } from 'react';
import { SocketContext } from '../../app/SocketContext'

function Home() {
    // const { me } = useContext(SocketContext)
    const me = '1'
    return (
        <div>
            <Link to='/call'>Calling</Link>
            <br />
            <Link to={`/room/23423SAF`}>Room</Link>
            <br />
            <Link to={`/join`}>Join</Link>
        </div>
    )
}
export default Home
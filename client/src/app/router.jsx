import { Router } from "@reach/router";
import Room from "../pages/room";
import VideoPlayer from '../pages/call/VideoPlayer';
import Home from "../pages/home";
import Join from '../pages/room/join'

function AppRouter() {
    return (
        <Router>
            {/* <Join path='/join' />
            <Room path='/room/:roomId' />
            <VideoPlayer path='/call' /> */}
            <Room path='/' default />
        </Router>
    )
}
export default AppRouter
import { Router } from "@reach/router";
import Room from "../pages/room";
import Home from "../pages/home";

function AppRouter() {
    return (
        <Router>
            <Room path='/room/:roomId' />
            <Home path='/' default />
        </Router>
    )
}
export default AppRouter
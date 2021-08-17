import { useState } from 'react'
import { navigate } from "@reach/router";

function Home() {
    const [title, setTitle] = useState('')

    const joinHandler = () => {
        if (!title) {
            alert('The meeting title is required!')
            return
        }

        navigate(`/room/${title}`)
    }

    return (
        <div>
            <h2>Welcome to app</h2>
            <input
                type="text"
                value={title}
                placeholder='Enter Meeting Title'
                onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={() => joinHandler()}>Start Meeting</button>
        </div>
    )
}
export default Home
import React from 'react';
import Footer from './footer'
import Body from './body'

import { io } from 'socket.io-client'
const socket = io('http://localhost:4000')



class Room extends React.Component {
    state = {
        msgArr: []
    }

    componentDidMount() {
        socket.on('me', (data) => {
            console.log('me', data)
        })

        socket.on('rcvMsg', (data) => {
            console.log('rcvMsg', data)
        })
    }

    messageSendHandler = (msg) => {
        socket.emit('sendMsg', { msg })
    }


    render() {
        return (
            <div>
                <hr />
                <Body msgArr={this.state.msgArr} />
                <hr />
                <Footer messageSendHandler={this.messageSendHandler} />
            </div>
        )
    }
}
export default Room
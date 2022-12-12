import React, { useEffect, useState } from 'react'
import axios from 'axios'
import urlcat from 'urlcat'
import { IChat } from '../Interface'

const Chat = () => {
    const [chats, setChats] = useState<IChat[]>([])

    const fetchChats = async () => {
        const SERVER = import.meta.env.VITE_SERVER
        const url = urlcat(SERVER, "/api/chat")
        const { data } = await axios.get(url)
        setChats(data)
    }

    useEffect(() => {
        fetchChats()
    }, [])

    return (
        <div className="App">
            <div>
                {chats.map((chat) =>
                    <div key={chat._id}>{chat.chatName}</div>)}

            </div>
            <h1 className="font-mont" >Chill Zone</h1>
            <h1 className="font-roboto" >Chill Zone</h1>
        </div>
    )
}

export default Chat
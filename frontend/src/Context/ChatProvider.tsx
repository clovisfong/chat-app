import React, { ReactNode, useContext, useEffect, useState } from "react";
import { IChat } from "../Interface";

type Props = { children: ReactNode }

const ChatContext = React.createContext({
});


const ChatProvider = ({ children }: Props) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState<IChat[]>([])


    useEffect(() => {

        const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}') // check later
        setUser(userInfo)


    }, [])

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider
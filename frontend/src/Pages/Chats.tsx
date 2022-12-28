import React, { useEffect, useState } from 'react'
import axios from 'axios'
import urlcat from 'urlcat'
import { IChat } from '../Interface'
import { ChatState } from '../Context/ChatProvider'
import { Box, Stack } from "@chakra-ui/react"
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'


const Chats = () => {

    const { user }: any = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

    return (

        <div >
            <Box
                display='flex'
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>


    )
}

export default Chats
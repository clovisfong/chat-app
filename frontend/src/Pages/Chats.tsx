import React, { useEffect, useState } from 'react'
import axios from 'axios'
import urlcat from 'urlcat'
import { IChat } from '../Interface'
import { ChatState } from '../Context/ChatProvider'
import { Box } from "@chakra-ui/react"
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'


const Chats = () => {

    const { user }: any = ChatState()

    return (

        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box
                display='flex'
                justifyContent='space-between'
                w='100%'
                h='91.5vh'
                p='10px'
            >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>


    )
}

export default Chats
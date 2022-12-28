import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { IFullUser } from '../Interface'
import { Box, Button, Text, Stack, useToast } from "@chakra-ui/react"
import SingleChat from './SingleChat'

type Props = {
    fetchAgain: boolean,
    setFetchAgain: (state: boolean) => void
}

const ChatBox = ({ fetchAgain, setFetchAgain }: Props) => {

    const { selectedChat }: any = ChatState()
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            bg="#F0F0F0"
            h='100vh'
            w={{ base: "100%", md: "68%" }}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, Text, Stack, useToast, Spinner, FormControl, Input, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react"
import { ArrowBackIcon, BellIcon, HamburgerIcon } from "@chakra-ui/icons";
import { IconButton } from '@chakra-ui/react'
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import urlcat from 'urlcat'
import axios from 'axios'
import { IMessages } from '../Interface';
import './styles.css'
import ScrollableChat from './ScrollableChat';
// import { Player } from '@lottiefiles/react-lottie-player';


import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
const ENDPOINT = "https://chat-app-backend-ubqx.onrender.com/" // to be replace with server link for production
var socket: any, selectedChatCompare: any;

type Props = {
    fetchAgain: boolean,
    setFetchAgain: (state: boolean) => void
}
const SingleChat = ({ fetchAgain, setFetchAgain }: Props) => {

    const [messages, setMessages] = useState<IMessages[]>([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const { selectedChat, setSelectedChat, user, notification, setNotification }: any = ChatState()

    const SERVER = import.meta.env.VITE_SERVER

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            setLoading(true)
            const url = urlcat(SERVER, `/api/message/${selectedChat._id}`)

            const { data } = await axios.get(url, config)

            console.log(messages)
            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the Message',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    // initialise socket first 
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

    }, [])


    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat
    }, [selectedChat])

    // retrieve message and send out notifications to the respective users
    useEffect(() => {
        socket.on("message received", (newMessageReceived: any) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                    // console.log('received noti', newMessageReceived)
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    // console.log('see', notification)
    const sendMessage = async (event: any) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const url = urlcat(SERVER, '/api/message')

                setNewMessage('') // won't affect the state so quickly because below is async function
                const { data } = await axios.post(url, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                console.log('this msg', data)
                socket.emit("new message", data);
                setMessages([...messages, data]);


            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the Message',
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    }


    const typingHandler = (e: any) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }

        }, timerLength)
    }


    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    return (
        <>
            <Box
                p={5}
                display='flex'
                justifyContent="space-between"
                alignItems="center"
                w="100%"
                borderBottom='1px solid #D7D7D7'
            >
                <Box display='flex' alignItems="center">
                    <ArrowBackIcon
                        display={{ base: "flex", md: "none" }}
                        mr={5}
                        cursor='pointer'
                        onClick={() => setSelectedChat("")}
                    />
                    {selectedChat ?
                        <Text fontSize='2xl' fontFamily='Work sans' cursor="pointer" >
                            {!selectedChat.isGroupChat ? (
                                <>

                                    <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                        {getSender(user, selectedChat.users)}
                                    </ProfileModal>
                                </>
                            ) : (
                                <>

                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    >
                                        {selectedChat.chatName.toUpperCase()}

                                    </UpdateGroupChatModal>


                                </>
                            )}
                        </Text> : <></>

                    }
                </Box>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif: any) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n: any) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>

                    </Menu>
                    <Menu>
                        <MenuButton >
                            <HamburgerIcon ml='10px' mr='10px' />
                        </MenuButton>

                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            {selectedChat ? (
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    bg="#F0F0F0"
                    w="100%"
                    h="100%"
                    overflowY="hidden"
                >
                    {loading ? (
                        <Spinner
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto" />
                    ) : (
                        <div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}

                    <FormControl
                        onKeyDown={sendMessage}
                        id="first-name"
                        isRequired
                        p={4}
                    >

                        {isTyping ?
                            // <Player
                            //     src='https://assets4.lottiefiles.com/packages/lf20_SCdC0F.json'
                            //     loop
                            //     autoplay
                            //     style={{ height: '70px', width: '70px' }}
                            // >

                            // </Player> 
                            <p>loading..</p>
                            : (<></>)}
                        <Input

                            bg="white"
                            placeholder="Enter a message.."
                            value={newMessage}
                            onChange={typingHandler}
                        />
                    </FormControl>
                </Box>


            ) : (
                // to get socket.io on same page
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat
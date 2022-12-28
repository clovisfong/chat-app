import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { IChat, IFullUser } from '../Interface'
import axios from 'axios'
import urlcat from 'urlcat'
import { Box, Button, Text, Stack, useToast, Tooltip, useDisclosure, Input, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Spinner } from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons";
import ChatLoading from './ChatLoading'
import { getSender } from '../config/ChatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'
import UserListItem from './UserAvatar/UserListItem'


type Props = {
    fetchAgain: boolean,
}

const MyChats = ({ fetchAgain }: Props) => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [loggedUser, setLoggedUser] = useState({})
    const { user, selectedChat, setSelectedChat, chats, setChats }: IFullUser | any = ChatState()
    const toast = useToast()
    const SERVER = import.meta.env.VITE_SERVER
    const { isOpen, onOpen, onClose } = useDisclosure()



    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            console.log

            const url = urlcat(SERVER, '/api/chat')
            const { data } = await axios.get(url, config)
            setChats(data)

        } catch (error) {

            toast({
                title: 'Error Occured!',
                description: 'Failed to load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const url = urlcat(SERVER, `/api/user?search=${search}`)
            const { data } = await axios.get(url, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the search results',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false);
        }
    }

    const accessChat = async (userId: string) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const url = urlcat(SERVER, '/api/chat')

            const { data } = await axios.post(url, { userId }, config)

            if (!chats.find((c: IChat) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error: any) {
            toast({
                title: 'Error fetching the chat!',
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }

    }

    useEffect(() => {

        setLoggedUser(JSON.parse(localStorage.getItem("userInfo") || '{}'))

        fetchChats()
    }, [fetchAgain])


    return (
        <>
            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                alignItems="center"
                flexDir="column"
                bg="white"
                w={{ base: "100%", md: "32%" }}
                h='100vh'
            >
                <Box
                    p={5}
                    fontSize={{ base: "15px", md: "20px" }}
                    fontFamily="Work sans"
                    display="flex"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom='1px solid #D7D7D7'
                >
                    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                        <Button variant='ghost' onClick={onOpen}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <Text
                                display={{ base: 'none', md: 'flex' }} px='4'
                            >Search User</Text>
                        </Button>
                    </Tooltip>

                    <GroupChatModal>
                        <EditIcon cursor={'pointer'} boxSize='40px' background='#6A538E' color="white" p='10px' borderRadius='20px' />
                    </GroupChatModal>

                </Box>


                <Box
                    display="flex"
                    flexDir="column"
                    w="100%"
                    h="100%"
                    p={5}
                    borderRadius="lg"
                    overflowY="hidden"
                >

                    {chats ? (
                        <Stack overflowY="scroll">
                            {chats.map((chat: IChat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#9C8DAF" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    p={4}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>

                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )}

                </Box>
            </Box>



            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (
                            searchResult?.map((user: IFullUser) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}

                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}


                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default MyChats
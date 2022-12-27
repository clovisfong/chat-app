import React, { useState } from 'react'
import {
    Tooltip, Box, Button, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Avatar, Drawer, useDisclosure, Input, useToast, Spinner,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../Context/ChatProvider';
import { IChat, IFullUser } from '../Interface';
import ProfileModal from './miscellaneous/ProfileModal';
import { useNavigate } from 'react-router-dom'
import urlcat from 'urlcat'
import axios from 'axios'
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';


const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()


    const { user, setSelectedChat, chats, setChats, notification, setNotification }: IFullUser | any = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const SERVER = import.meta.env.VITE_SERVER

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
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

    console.log('noti in side drawer', notification)

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

    return (
        <>
            <Box
                display='flex'
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant='ghost' onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text
                            display={{ base: 'none', md: 'flex' }} px='4'
                        >Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily='Work sans'>
                    Chat App
                </Text>
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
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
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

export default SideDrawer
import React, { ReactNode, useState } from 'react'
import {
    useDisclosure, Button, Image, Box, useToast, FormControl, Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react"
import { IFullUser, IUser } from '../../Interface'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import urlcat from 'urlcat'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

type Props = {
    children: ReactNode
}

const GroupChatModal = ({ children }: Props) => {

    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState<IFullUser[]>([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState<IFullUser[]>([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, chats, setChats }: IFullUser | any = ChatState()
    const SERVER = import.meta.env.VITE_SERVER


    const handleSearch = async (query: any) => {
        setSearch(query)
        if (!query) {
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
                description: 'Failed to load search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const url = urlcat(SERVER, '/api/chat/group')

            const { data } = await axios.post(url, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user => user._id))
            }, config)

            setChats([data, ...chats])
            onClose()
            toast({
                title: 'New Group Chat Created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })


        } catch (error: any) {
            toast({
                title: 'Failed to create group chat',
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }

    }

    const handleGroup = (userToAdd: IFullUser) => {

        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (delUser: IFullUser) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== delUser._id))
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="25px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody display="flex" flexDir="column" alignItems="center">

                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e: any) => { setGroupChatName(e.target.value) }}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={3}
                                onChange={(e) => { handleSearch(e.target.value) }}
                            />
                        </FormControl>

                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedUsers.map((user: IFullUser) =>
                                (<UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />))}
                        </Box>


                        {loading ? <div>loading</div> :
                            (searchResult?.slice(0, 4).map((user: IFullUser) =>
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />))}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
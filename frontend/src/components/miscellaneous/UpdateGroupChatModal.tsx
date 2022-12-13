import React, { useState } from 'react'
import {
  useDisclosure, Button, Image, Box, useToast, FormControl, Input, IconButton, Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import { IFullUser } from '../../Interface';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios'
import urlcat from 'urlcat'
import UserListItem from '../UserAvatar/UserListItem';

type Props = {
  fetchAgain: boolean,
  setFetchAgain: (state: boolean) => void
}

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }: Props) => {

  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState()
  const [searchResult, setSearchResult] = useState<IFullUser[]>([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedChat, setSelectedChat, user }: any = ChatState()
  const SERVER = import.meta.env.VITE_SERVER



  const handleRemove = async (user1: IFullUser) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
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

      const url = urlcat(SERVER, 'api/chat/groupremove')

      const { data } = await axios.put(url, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config)

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data)

      setFetchAgain(!fetchAgain)
      setLoading(false)


    } catch (error: any) {
      toast({
        title: 'Error Occured',
        status: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }
  }

  const handleAddUser = async (user1: IFullUser) => {
    if (selectedChat.users.find((user: IFullUser) => user._id === user1._id)) {
      toast({
        title: 'User already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
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

      const url = urlcat(SERVER, 'api/chat/groupadd')

      const { data } = await axios.put(url, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)


    } catch (error: any) {
      toast({
        title: 'Error Occured',
        status: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }

  }



  const handleRename = async (x: any) => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const url = urlcat(SERVER, 'api/chat/rename')

      const { data } = await axios.put(url, {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)

    } catch (error: any) {
      toast({
        title: 'Error Occured',
        status: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setRenameLoading(false)
    }

    setGroupChatName("")
  }



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
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton
        aria-label='Open Group Chat Settings'
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>

          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((user: IFullUser) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
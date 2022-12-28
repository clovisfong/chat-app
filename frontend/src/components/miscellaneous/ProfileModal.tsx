import React, { ReactNode } from 'react'
import {
    useDisclosure, IconButton, Button, Image, Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    background,
} from "@chakra-ui/react"
import { SettingsIcon } from "@chakra-ui/icons";
import { IFullUser } from '../../Interface';

type Props = {
    children?: ReactNode,
    user: IFullUser
}

const ProfileModal = ({ user, children }: Props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (

                <SettingsIcon onClick={onOpen} cursor="pointer" />
            )}

            <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h='400px'>
                    <ModalHeader
                        fontSize="25px"
                        fontFamily='Work sans'
                        display="flex"
                        justifyContent='center'
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: '20px' }}
                            fontFamily='Work sans'
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
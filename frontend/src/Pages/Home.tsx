import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import axios from 'axios'
import urlcat from 'urlcat'

const Home = () => {

    // const navigate = useNavigate()

    // useEffect(() => {

    //     const user = JSON.parse(localStorage.getItem("userInfo") || '{}') // check later

    //     if (user) {
    //         navigate('/chats')
    //     }

    // }, [])

    const SERVER = import.meta.env.VITE_SERVER

    const url = urlcat(SERVER, '/')

    const fetchChats = async () => {
        const data = await axios.get(url)
        console.log(data)
    }

    useEffect(() => {
        fetchChats()
    }, [])

    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={'lightblue'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text>hello there, lets chat</Text>
            </Box>
            <Box
                bg={'lightblue'}
                w='100%'
                p={4}
                borderRadius='lg'
                borderWidth='1px'>

                <Tabs variant='soft-rounded'>
                    <TabList mb='1em'>
                        <Tab w='50%'>Login</Tab>
                        <Tab w='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home
import React from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react"
import Login from './components/Login'
import SignUp from './components/SignUp'

const Home = () => {
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
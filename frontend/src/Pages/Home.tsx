import React, { useState } from 'react'
import Login from '../components/Login'
import SignUp from '../components/SignUp'

const Home = () => {
    const [login, setLogin] = useState('Login')

    const handleLogin = () => {
        setLogin('Login')
    }

    const handleSignUp = () => {
        setLogin('SignUp')
    }

    return (
        <div className='container'>
            <div className='bg-orange text-center p-10'>
                <h1 className='text-4xl font-mont'>Chat App</h1>
            </div>

            <div className='bg-peach flex-column  p-20 pt-10'>
                <div className='flex space-x-4 mb-10'>
                    <button className='bg-beige p-2 px-5 w-1/2 rounded-full' onClick={handleLogin}>Login</button>
                    <button className='bg-beige p-2 px-5 w-1/2 rounded-full' onClick={handleSignUp}>Sign Up</button>
                </div>
                {login === 'Login' ? <Login /> : <SignUp />}
            </div>


        </div>
    )
}

export default Home
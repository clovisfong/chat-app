import React, { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(name)
    }

    const handleClick = () => {
        setEmail("guest@example.com")
        setPassword('123')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <h5 className='mt-4'>Email</h5>
                <input value={email} className=" px-3 py-2 w-full rounded-lg mt-2" type='email' placeholder='Enter your email' required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <h5 className='mt-4'>Password</h5>
                <input value={password} className=" px-3 py-2 w-full rounded-lg mt-2" type='password' placeholder='Enter your password' required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='bg-beige mt-10 p-2 px-4 w-full rounded-lg' type='submit'>Sign Up</button>

            </form>
            <button className='bg-grey mt-5 p-2 px-4 w-full rounded-lg' onClick={handleClick}>Get User Credentials</button>



        </div>
    )
}

export default Login
import React, { useState } from 'react'

const SignUp = () => {
    // const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pic, setPic] = useState('')



    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(name)
    }

    const postDetails = (e: any) => {

    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h5 className='mt-4'>Name</h5>
                <input value={name} className=" px-3 py-2 w-full rounded-lg mt-2" type='text' placeholder='Enter your name' required
                    onChange={(e) => setName(e.target.value)}
                />

                <h5 className='mt-4'>Email</h5>
                <input value={email} className=" px-3 py-2 w-full rounded-lg mt-2" type='email' placeholder='Enter your email' required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <h5 className='mt-4'>Password</h5>
                <input value={password} className=" px-3 py-2 w-full rounded-lg mt-2" type='password' placeholder='Enter your password' required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <h5 className='mt-4'>Confirm Password</h5>
                <input value={confirmPassword} className=" px-3 py-2 w-full rounded-lg mt-2" type='password' placeholder='Enter your confirm password' required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <h5 className='mt-4'>Upload your picture</h5>
                <input className=" py-2 mt-2 w-full" type='file' accept='images/*'
                    onChange={(e) => postDetails}
                />

                <button className='bg-beige mt-10 p-2 px-4 w-full rounded-lg' type='submit'>Sign Up</button>

            </form>


        </div>
    )
}

export default SignUp
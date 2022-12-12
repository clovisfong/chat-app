import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Chats from './Pages/Chats'

function App() {


  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/chats' element={<Chats />} />
    </Routes>
  )
}

export default App

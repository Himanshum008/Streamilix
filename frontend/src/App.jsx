import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignUp from './Pages/SignUp.jsx'
import SignIn from './Pages/SignIn.jsx'

export const serverUrl = "http://localhost:8000"

function App() {
  
  return (
    <>
  <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/signup' element={<SignUp />} />
  <Route path='/signin' element={<SignIn />} />
  </Routes>
  </>
  )
}

export default App

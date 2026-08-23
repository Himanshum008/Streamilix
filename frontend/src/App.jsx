import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import CustomAlert from './components/CustomAlert.jsx'
import Shorts from './Pages/Shorts/Shorts.jsx'

export const serverUrl = "http://localhost:8000"

function App() {
  
  return (
    <>
    <CustomAlert />
  <Routes>
  <Route path='/' element={<Home />} >
    <Route path='/shorts' element={<Shorts />} />
  </Route>
  <Route path='/signup' element={<SignUp />} />
  <Route path='/signin' element={<SignIn />} />
  <Route path='/home' element={<Home/>} />
  </Routes>
  </>
  )
}

export default App

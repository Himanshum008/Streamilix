import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import CustomAlert from './components/CustomAlert.jsx'
import Shorts from './Pages/Shorts/Shorts.jsx'
import GetCurrentUser from './customHooks/GetCurrentUser.jsx'
import MobileProfile from './components/MobileProfile.jsx'
import ForgetPassword from './Pages/ForgetPassword.jsx'
import CreateChannel from './Pages/Channel/CreateChannel.jsx'
import ViewChannel from './Pages/Channel/ViewChannel.jsx'
import GetChannelData from './customHooks/GetChannelData.jsx'
import UpdateChannel from './Pages/Channel/UpdateChannel.jsx'

export const serverUrl = "http://localhost:8000"

function App() {
  GetChannelData()
  GetCurrentUser()

  return (
    <>
    <CustomAlert />
  <Routes>
  <Route path='/' element={<Home />} >
    <Route path='/mobileprofile' element={<MobileProfile />} />
    <Route path='/viewchannel' element={<ViewChannel />} />
    <Route path='/shorts' element={<Shorts />} />
    <Route path='/updatechannel' element={<UpdateChannel />} />
  </Route>
  <Route path='/signup' element={<SignUp />} />
  <Route path='/signin' element={<SignIn />} />
  <Route path='/forgetpassword' element={<ForgetPassword />} />
  <Route path='/home' element={<Home />} />
  <Route path='/createchannel' element={<CreateChannel />} />
  
  </Routes>
  </>
  )
}

export default App

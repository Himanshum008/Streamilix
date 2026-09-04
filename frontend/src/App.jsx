import { Children, useState } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import CustomAlert, { showCustomAlert } from './components/CustomAlert.jsx'
import Shorts from './Pages/Shorts/Shorts.jsx'
import GetCurrentUser from './customHooks/GetCurrentUser.jsx'
import MobileProfile from './components/MobileProfile.jsx'
import ForgetPassword from './Pages/ForgetPassword.jsx'
import CreateChannel from './Pages/Channel/CreateChannel.jsx'
import ViewChannel from './Pages/Channel/ViewChannel.jsx'
import GetChannelData from './customHooks/GetChannelData.jsx'
import UpdateChannel from './Pages/Channel/UpdateChannel.jsx'
import { useSelector } from 'react-redux'
import CreatePage from './Pages/CreatePage.jsx'

export const serverUrl = "http://localhost:8000"

const ProtectRoute = ({userData, children}) => {
  if (!userData) {
    showCustomAlert("Please sign up first to the features!")
    return <Navigate to={"/"} replace/>
  }
  return children
}

function App() {
  GetChannelData()
  GetCurrentUser()

  const {userData} = useSelector(state => state.user)

  return (
    <>
    <CustomAlert />
  <Routes>
  <Route path='/' element={<Home />} >
    <Route path='/mobileprofile' element={<ProtectRoute userData={userData}><MobileProfile /></ProtectRoute>} />
    <Route path='/viewchannel' element={<ProtectRoute userData={userData}><ViewChannel /></ProtectRoute>} />
    <Route path='/shorts' element={<ProtectRoute userData={userData}><Shorts /></ProtectRoute>} />
    <Route path='/updatechannel' element={<ProtectRoute userData={userData}><UpdateChannel /></ProtectRoute>} />
    <Route path='/create' element={<ProtectRoute userData={userData}><CreatePage /></ProtectRoute>} />
  </Route>
  <Route path='/signup' element={<SignUp />} />
  <Route path='/signin' element={<SignIn />} />
  <Route path='/forgetpassword' element={<ForgetPassword />} />
  <Route path='/home' element={<Home />} />
  <Route path='/createchannel' element={<ProtectRoute userData={userData}><CreateChannel /></ProtectRoute>} />
  
  </Routes>
  </>
  )
}

export default App

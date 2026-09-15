import { Children, useState } from 'react'
import { Routes,Route, Navigate, useLocation } from 'react-router-dom'
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
import CreateVideos from './Pages/Videos/CreateVideos.jsx'
import CreateShorts from './Pages/Shorts/CreateShorts.jsx'
import CreatePlaylists from './Pages/Playlist/CreatePlaylists.jsx'
import CreatePosts from './Pages/Post/CreatePosts.jsx'
import GetAllContentData from './customHooks/GetAllContentData.jsx'
import PlayVideo from './Pages/Videos/PlayVideo.jsx'
import PlayShort from './Pages/Shorts/PlayShort.jsx'
import ChannelPage from './Pages/Channel/ChannelPage.jsx'
import LikedContent from './Pages/LikedContent.jsx'
import SavedContent from './Pages/SavedContent.jsx'
import SavedPlaylist from './Pages/Playlist/SavedPlaylist.jsx'
import GetSubscribedData from './customHooks/GetSubscribedData.jsx'
import Subscription from './Pages/Subscription.jsx'
import GetHistory from './customHooks/GetHistory.jsx'
import HistoryContent from './Pages/HistoryContent.jsx'
import GetRecommendedContent from './customHooks/GetRecommendedContent.jsx'
import PTStudio from './Pages/PTStudio.jsx'
import Dashboard from './components/Dashboard.jsx'
import Analytics from './components/Analytics.jsx'
import Content from './components/Content.jsx'
import Revenue from './components/Revenue.jsx'

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
  GetAllContentData()
  GetSubscribedData()
  GetHistory()
  GetRecommendedContent()

  const {userData} = useSelector(state => state.user)
  function ChannelPageWrapper() {
    const location = useLocation()
    return <ChannelPage key={location.pathname}/>
  }

  return (
    <>
    <CustomAlert />
  <Routes>
  <Route path='/' element={<Home />} >
    <Route path='/shorts' element={<ProtectRoute userData={userData}><Shorts /></ProtectRoute>} />
    <Route path='/playshort/:shortId' element={<ProtectRoute userData={userData}><PlayShort /></ProtectRoute>} />
    <Route path='/mobileprofile' element={<ProtectRoute userData={userData}><MobileProfile /></ProtectRoute>} />
    <Route path='/viewchannel' element={<ProtectRoute userData={userData}><ViewChannel /></ProtectRoute>} />
    <Route path='/updatechannel' element={<ProtectRoute userData={userData}><UpdateChannel /></ProtectRoute>} />
     <Route path='/create' element={<ProtectRoute userData={userData}><CreatePage /></ProtectRoute>} />
    <Route path='/createvideo' element={<ProtectRoute userData={userData}><CreateVideos /></ProtectRoute>} />
    <Route path='/createshort' element={<ProtectRoute userData={userData}><CreateShorts /></ProtectRoute>} />
    <Route path='/createplaylist' element={<ProtectRoute userData={userData}><CreatePlaylists /></ProtectRoute>} />
    <Route path='/createpost' element={<ProtectRoute userData={userData}><CreatePosts /></ProtectRoute>} />

    <Route path='/channelpage/:channelId' element={<ProtectRoute userData={userData}><ChannelPageWrapper /></ProtectRoute>} />

    <Route path='/likedcontent' element={<ProtectRoute userData={userData}><LikedContent /></ProtectRoute>} />
    <Route path='/savedcontent' element={<ProtectRoute userData={userData}><SavedContent /></ProtectRoute>} />
    <Route path='/savedplaylist' element={<ProtectRoute userData={userData}><SavedPlaylist /></ProtectRoute>} />
    <Route path='/subscription' element={<ProtectRoute userData={userData}><Subscription /></ProtectRoute>} />
    <Route path='/history' element={<ProtectRoute userData={userData}><HistoryContent /></ProtectRoute>} />
  </Route>
  <Route path='/signup' element={<SignUp />} />
  <Route path='/signin' element={<SignIn />} />
  <Route path='/forgetpassword' element={<ForgetPassword />} />
  <Route path='/home' element={<Home />} />
  <Route path='/createchannel' element={<ProtectRoute userData={userData}><CreateChannel /></ProtectRoute>} />
  <Route path='/playvideo/:videoId' element={<ProtectRoute userData={userData}><PlayVideo /></ProtectRoute>} />


  <Route path='/ptstudio' element={<ProtectRoute userData={userData}><PTStudio /></ProtectRoute>} >
    <Route path='/ptstudio/dashboard' element={<ProtectRoute userData={userData}><Dashboard /></ProtectRoute>} />
    <Route path='/ptstudio/analytics' element={<ProtectRoute userData={userData}><Analytics /></ProtectRoute>} />
    <Route path='/ptstudio/content' element={<ProtectRoute userData={userData}><Content /></ProtectRoute>} />
    <Route path='/ptstudio/revenue' element={<ProtectRoute userData={userData}><Revenue /></ProtectRoute>} />
  </Route>
  </Routes>
  </>
  )
}

export default App

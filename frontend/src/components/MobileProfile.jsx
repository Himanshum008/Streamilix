import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {FiLogOut} from "react-icons/fi"
import {FcGoogle} from "react-icons/fc"
import { MdOutlineSwitchAccount } from 'react-icons/md'
import {TiUserAddOutline} from "react-icons/ti"
import { SiYoutubestudio } from 'react-icons/si'
import { 
  FaHistory,
  FaList,
  FaThumbsUp,
 } from 'react-icons/fa'
import { GoVideo } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setUserData } from '../redux/userSlice.js'
import { serverUrl } from '../App.jsx'
import { showCustomAlert } from './CustomAlert.jsx'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/firebase.js'

function MobileProfile() {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignout = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/signout" , {withCredentials:true})
            dispatch(setUserData(null))
            console.log(result.data);
            showCustomAlert("Signout Successfully")
        } catch (error) {
            console.log(error);
            showCustomAlert("Signout error")
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            console.log(response);
            let user = response.user
            let userName = user.displayName
            let email = user.email
            let photoUrl = user.photoURL

            const formData = new FormData()
            formData.append("userName", userName)
            formData.append("email", email)
            formData.append("photoUrl", photoUrl)

            const result = await axios.post(serverUrl + "/api/auth/googleauth" , formData , {withCredentials:true})
            dispatch(setUserData(result.data))
            console.log(result.data);
            showCustomAlert("Google Authentication Successfully")
            
        } catch (error) {
            console.log(error);
            showCustomAlert("Google Authentication error")
        }
    }

  return (
    <div className='md:hidden bg-[#0f0f0f] h-full w-full flex flex-col pt-25 p-2.5'>
        {/* top profile section */}
        {userData && <div className='p-4 flex items-center gap-4 border-b border-gray-800'>
            {userData?.photoUrl && <img src={userData?.photoUrl} alt="" className='w-16 h-16 rounded-full object-cover'/>}
            <div className='flex flex-col'>
                <span className='font-semibold text-lg'>{userData?.userName}</span>
                <span className='text-gray-400 text-sm'>{userData?.email}</span>
                <p className='text-sm text-blue-400 cursor-pointer hover:underline' 
                onClick={()=>{userData?.channel ? navigate("/viewchannel"): navigate("/createchannel")}}>
                    {userData?.channel ? "view channel" : "create channel"}</p>
            </div>
        </div>}

        {/* auth button */}
        <div className='flex gap-2 p-4 border-b border-gray-800 overflow-auto'>
            <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center'>
                <FcGoogle className='text-xl' onClick={handleGoogleAuth}/>Sign in with Google Account</button>
            <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center'>
                <TiUserAddOutline className='text-xl' onClick={()=>navigate("/signup")}/>Create new Account</button>
            <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center'>
                <MdOutlineSwitchAccount className='text-xl' onClick={()=>navigate("/signin")}/>Sign in with your Account</button>
            <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center'>
                <FiLogOut className='text-xl' onClick={handleSignout}/>Sign out</button>
        </div>

        <div className='flex flex-col mt-5'>
            <ProfileMeanuItem icon={<FaHistory />} text={"History"} onClick={()=>navigate("/history")}/>
            <ProfileMeanuItem icon={<FaList />} text={"Playlists"} onClick={()=>navigate("/savedplaylist")}/>
            <ProfileMeanuItem icon={<GoVideo />} text={"Save Videos"} onClick={()=>navigate("/savedcontent")}/>
            <ProfileMeanuItem icon={<FaThumbsUp />} text={"Liked Videos"} onClick={()=>navigate("/likedcontent")}/>
            <ProfileMeanuItem icon={<SiYoutubestudio className='text-xl text-orange-400' />} text={"PT Studio"} 
            onClick={()=>navigate("/ptstudio/dashboard")}/>
        </div>


    </div>
  )
}


function ProfileMeanuItem ({icon,text,onClick}) {
    return (
        <button onClick={onClick} 
        className='w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left'>
            <span className='text-lg'>{icon}</span>
            <span className='text-sm'>{text}</span>

        </button>
    )
}


export default MobileProfile
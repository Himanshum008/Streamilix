import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {FiLogOut} from "react-icons/fi"
import {FcGoogle} from "react-icons/fc"
import { MdOutlineSwitchAccount } from 'react-icons/md'
import {TiUserAddOutline} from "react-icons/ti"
import { SiYoutubestudio } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { showCustomAlert } from './CustomAlert'
import { setUserData } from '../redux/userSlice'

function Profile() {
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

  return (

    <div className='absolute right-5 top-10 mt-2 w-90 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:block'>
        {userData && <div className='flex items-center gap-3 p-4 border-b border-gray-700'>
            <img src={userData?.imageUrl} alt="image" className='w-12 h-12 flex items-center justify-center rounded-full
            object-cover border border-gray-700'/>
            <div>
                <h4 className='font-semibold'>{userData?.username}</h4>
                <p className='text-sm text-gray-400 overflow-auto'>{userData.email}</p>
                <p className='text-sm text-blue-400 cursor-pointer hover:underline'>
                    {userData?.channel ? "view channel" : "create channel"}</p>
            </div>
        </div>}

        <div className='flex flex-col py-2'>
            <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'>
                <FcGoogle className='text-xl'/>Sign in with google account</button>
            <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700' onClick={()=>navigate("/signup")}>
                <TiUserAddOutline className='text-xl' />Create new Account</button>
            <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700' onClick={()=>navigate("/signin")}>
                <MdOutlineSwitchAccount className='text-xl' />Sign in with other Account</button>
            {userData?.channel && <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'>
                <SiYoutubestudio className='w-5 h-5 text-orange-500'/>PT studio</button>}
            {userData && <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'>
                <FiLogOut className='text-xl' onClick={handleSignout}/>Signout</button>}
        </div> 
    </div>
  )
}

export default Profile
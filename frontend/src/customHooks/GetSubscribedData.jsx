import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { 
    setSubscribedChannels,
    setSubscribedPlaylists, 
    setSubscribedPosts, 
    setSubscribedShorts, 
    setSubscribedVideos
} from '../redux/userSlice.js'
import { useLocation } from 'react-router-dom'

const GetSubscribedData = () => {
  const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    const location = useLocation()

    useEffect(()=>{
        const fetchSubscribedData = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/subscribed-content", {
                    withCredentials: true
                })
                
                console.log(result.data);
                dispatch(setSubscribedChannels(result.data.subscribedChannels || []))
                dispatch(setSubscribedVideos(result.data.videos || []))
                dispatch(setSubscribedShorts(result.data.shorts || []))
                dispatch(setSubscribedPlaylists(result.data.playlists || []))
                dispatch(setSubscribedPosts(result.data.posts || []))
            } catch (error) {
                console.log(error);
            }
        }
        fetchSubscribedData()
    },[dispatch, userId, location.pathname])
}

export default GetSubscribedData
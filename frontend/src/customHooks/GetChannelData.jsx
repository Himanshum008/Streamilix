import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setChannelData } from '../redux/userSlice.js'
import { serverUrl } from '../App.jsx'

function GetChannelData() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchChannel = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/getchannel", {
                    withCredentials: true
                })
                dispatch(setChannelData(result.data))
                console.log(result.data);
                
            } catch (error) {
                console.log(error);
                
                dispatch(setChannelData(null))
            }
        }
        fetchChannel()
    },[])
}

export default GetChannelData;
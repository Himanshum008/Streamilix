import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App.jsx'
import { setHistoryShort, setHistoryVideo } from '../redux/userSlice.js'

function GetHistory() {
   const dispatch = useDispatch()

    useEffect(()=>{
        const fetchHistory = async () => {
            try {
                const result = await axios.get(serverUrl  + "/api/user/gethistory", {
                    withCredentials: true
                })
                const history = result.data

                const Videos = history.filter((v)=>v.contentType === "Video")
                const Shorts = history.filter((v)=>v.contentType === "Short")
                dispatch(setHistoryVideo(Videos))
                dispatch(setHistoryShort(Shorts))
                console.log(Videos , Shorts);
                
            } catch (error) {
                console.log(error);
                dispatch(setHistoryVideo(null))
                dispatch(setHistoryShort(null))
            }
        }
        fetchHistory()
    },[])
}

export default GetHistory
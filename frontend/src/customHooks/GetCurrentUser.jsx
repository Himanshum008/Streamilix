import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../App.jsx"
import { setUserData } from "../redux/userSlice.js"



const GetCurrentUser = () => {
    const dispatch = useDispatch()
    const {channelData} = useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/getuser", {
                    withCredentials: true
                })
                dispatch(setUserData(result.data))
                console.log(result.data);
                
            } catch (error) {
                console.log(error);
                
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    },[channelData])
}

export default GetCurrentUser

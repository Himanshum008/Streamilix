import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../App.jsx"
import { setUserData } from "../redux/userSlice.js"



const GetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                axios.get(serverUrl + "/api/user/getuser", {
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
    },[])
}

export default GetCurrentUser

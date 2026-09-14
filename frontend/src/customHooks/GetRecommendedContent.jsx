import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setRecommendedContent } from "../redux/userSlice.js";

function GetRecommendedContent() {
    const dispatch = useDispatch()
     
    useEffect(()=>{
        const fetchRecommendedContent = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/recommendation", {
                    withCredentials: true
                })
                dispatch(setRecommendedContent(result.data))
                console.log(result.data);
                
            } catch (error) {
                console.log(error);
                dispatch(setRecommendedContent(null))
            }
        }
        fetchRecommendedContent()
    },[])
}

export default GetRecommendedContent;
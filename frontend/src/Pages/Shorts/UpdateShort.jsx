import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../../App.jsx'
import { showCustomAlert } from '../../components/CustomAlert.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { setAllShortsData } from '../../redux/contentSlice.js'
import { setChannelData } from '../../redux/userSlice.js'

function UpdateShort() {
    const {shortId} = useParams()
  const {channelData} = useSelector(state=>state.user)
  const {allShortsData} = useSelector(state=>state.content)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(()=>{
    const fetchShort = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/content/fetchshort/${shortId}` , {withCredentials:true});
            setTitle(res.data.title)
            setDescription(res.data.description || "")
            setTags(res.data.tags.join(", "))
          } catch (error) {
            showCustomAlert(error.response?.data?.message || "Failed to load short");
            navigate("/")
          }
        }
        fetchShort()
      },[shortId])


      const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${serverUrl}/api/content/update-short/${shortId}` , {
                title, description, tags: JSON.stringify(
                    tags.split(",").map((t) => t.trim()).filter(Boolean)
                ),
            } , {withCredentials:true});

            const updatedShort = res.data;

            const updatedAllShorts = allShortsData.map((s) => s._id === shortId ? updatedShort : s)

            dispatch(setAllShortsData(updatedAllShorts));
            setLoading(false)

            const updatedChannel = {
                ...channelData,
                shorts: channelData.shorts.map((s)=>s._id === shortId ? updatedShort : s)
            }
            dispatch(setChannelData(updatedChannel))

            showCustomAlert("Short updated successfully", "success");
            navigate("/streamilixstudio/content")
        } catch (error) {
            console.log(error);
            showCustomAlert("Failed to update short", "error")
        }finally{
        setLoading(false)
    }
}


    const handleDelete = async () => {
        if (!window.confirm("Are you really want to delete this short?")) return;

        setLoading1(true)
        try {
            await axios.delete(`${serverUrl}/api/content/delete-short/${shortId}` , {withCredentials:true})

            const updatedAllShorts = allShortsData.filter((s) => s._id !== shortId);
            dispatch(setAllShortsData(updatedAllShorts));

            const updatedChannel = {
                ...channelData,
                shorts: channelData.shorts.filter((s) => s._id !== shortId),
            };
            dispatch(setChannelData(updatedChannel))

            showCustomAlert("Video deleted successfully", "success");
            setLoading(false)
            navigate("/streamilixstudio/content");
        } catch (error) {
            console.error(error);
            setLoading(false)
            showCustomAlert("Failed to delete short", "error")
        }
    }

  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <main className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#212121] p-6 rounded-xl w-full max-w-xl shadow-lg flex flex-col items-center justify-center gap-6'>


          <div className='flex flex-col space-y-4 w-full'>
            <input type="text" placeholder='Title*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white
            focus:ring-2 focus:ring-orange-500 focus:outline-none' onChange={(e)=>setTitle(e.target.value)} value={title}/>
            <textarea placeholder='Description*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white
            focus:ring-2 focus:ring-orange-500 focus:outline-none' onChange={(e)=>setDescription(e.target.value)} value={description}/>
            <input type="text" placeholder='Tags* (comma separated)' className='w-full p-3 rounded-lg bg-[#121212] border 
            border-gray-700 text-whitefocus:ring-2 focus:ring-orange-500 focus:outline-none' 
            onChange={(e)=>setTags(e.target.value)} value={tags}/>

            <button className='w-full bg-blue-600 hover:bg-blue-700 py-3 
            rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center' onClick={handleUpdate}>
              {loading? <ClipLoader color='black' size={20}/>:"Update Short"}</button>
              <button className='w-full bg-orange-600 hover:bg-orange-700 py-3 
            rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center' onClick={handleDelete}>
              {loading? <ClipLoader color='black' size={20}/>:"Delete Short"}</button>
              {loading && <p className='text-center text-gray-300 text-sm animate-pulse'>Short Updating... please wait...</p>}
          </div>

        </div>
      </main>
    </div>
  )
}

export default UpdateShort
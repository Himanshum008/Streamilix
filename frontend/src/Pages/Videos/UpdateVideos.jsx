import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { serverUrl } from '../../App'
import { showCustomAlert } from '../../components/CustomAlert'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { setAllVideosData } from '../../redux/contentSlice'
import { setChannelData } from '../../redux/userSlice'

function UpdateVideos() {
    const {videoId} = useParams()
  const {channelData} = useSelector(state=>state.user)
  const {allVideosData} = useSelector(state=>state.content)

  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  
  const handleThumbnail = (e) =>{
    setThumbnail(e.target.files[0])
  }

  useEffect(()=>{
      const fetchVideo = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/content/fetchvideo/${videoId}` , {withCredentials:true});
          setTitle(res.data.title)
          setDescription(res.data.description || "")
          setTags(res.data.tags.join(", "))
        } catch (error) {
          showCustomAlert(error.response?.data?.message || "Failed to load video");
          navigate("/")
        }
      }
      fetchVideo()
    },[videoId])

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("tags", JSON.stringify(tags.split(",").map((t)=> t.trim())));
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const result = await axios.post(`${serverUrl}/api/content/update-video/${videoId}` , formData , {withCredentials:true})

            const UpdatedVideos = allVideosData.map((v)=> v._id === videoId ? result.data : v);
            dispatch(setAllVideosData(UpdatedVideos))
            showCustomAlert("Video updated successfully");
            navigate("/streamilixstudio/content")
        } catch (error) {
            console.log(error);
            setLoading(false)            
            showCustomAlert(error.response?.data?.message || "Update failed")
        }
    }


    const handleDelete = async () => {
        if (!window.confirm("Are you really want to delete this video?")) return;

        setLoading1(true)
        try {
            await axios.delete(`${serverUrl}/api/content/delete-video/${videoId}` , {withCredentials:true})

            dispatch(setAllVideosData(allVideosData.filter((v)=>v._id !== videoId)));

            showCustomAlert("Video deleted successfully");
            navigate("/streamilixstudio/content");
        } catch (error) {
            showCustomAlert(error.response?.data?.message || "Delete failed")
        }finally{
        setLoading1(false);
    }
}

  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex items-center justify-center flex-col pt-5'>
      <div className='flex flex-1 justify-center items-center px-4 py-6'>

        <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6'>
          

          <input type="text" placeholder='Title*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white
          focus:ring-2 focus:ring-orange-500 focus:outline-none' onChange={(e)=>setTitle(e.target.value)} value={title}/>

          <textarea  placeholder='Description*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white
          focus:ring-2 focus:ring-orange-500 focus:outline-none' onChange={(e)=>setDescription(e.target.value)} value={description}/>
          
          <input type='text' placeholder='Tags*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white
          focus:ring-2 focus:ring-orange-500 focus:outline-none' onChange={(e)=>setTags(e.target.value)} value={tags}/>

            {/* upload thumbnail */}
            <label htmlFor="thumbnail" className='block cursor-pointer'>
              
              {
                thumbnail ? (
                <img src={URL.createObjectURL(thumbnail)}
                className='w-full rounded-lg border border-gray-700 mb-2 object-cover'/>
              ) : (
              <div className='w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border
              border-gray-700 mb-2'>
                Click to upload thumbnail
              </div>
            )}

            <input type="file" id='thumbnail' className='hidden' accept='image/*' onChange={handleThumbnail} />
            </label>

            <button className='w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600
            flex items-center justify-center' disabled={loading} onClick={handleUpdate}
            >{loading?<ClipLoader color='black' size={20}/>:"Update video"}</button>
            <button className='w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600
            flex items-center justify-center' disabled={loading1} onClick={handleDelete}
            >{loading1 ?<ClipLoader color='black' size={20}/>:"Delete video"}</button>
            {loading && <p className='text-gray-300 text-sm animate-pulse text-center'>Video Updating... please wait....</p>}
        </div>


      </div>
    </div>
  )
}

export default UpdateVideos
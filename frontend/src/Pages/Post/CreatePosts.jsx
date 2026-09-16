import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa'
import { showCustomAlert } from '../../components/CustomAlert.jsx'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../../App'
import { useNavigate } from 'react-router-dom'
import { setChannelData } from '../../redux/userSlice'
import { ClipLoader } from 'react-spinners'

function CreatePosts() {
  const {channelData} = useSelector(state=>state.user)
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreatePost = async () => {
      if (!content) {
        showCustomAlert("Post content is required!")
        return
      }
      if (!channelData?._id) {
        showCustomAlert("Channel data is not available")
        return
      }
      const formData = new FormData()
      formData.append("channelId", channelData._id)
      formData.append("content", content)
      if (image) formData.append("image", image)
        setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/content/create-post" , formData , {withCredentials:true})
      const updatechannel = {
        ...channelData , communityPosts : [...(channelData.communityPosts || []), result.data]
          }
          dispatch(setChannelData(updatechannel))
          console.log(result.data);
          showCustomAlert("Post created")
          navigate("/")
          setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      showCustomAlert(`Failed to create post`)
    }
  }

  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-20 items-center justify-center'>
      <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4'>
        <textarea className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 
        focus:ring-orange-500 focus:outline-none h-28' 
        placeholder='Write something for community....' onChange={(e)=>setContent(e.target.value)} value={content}/>

        <label htmlFor="image" className='flex items-center space-x-3 cursor-pointer'>
          <FaImage className='text-2xl text-gray-300'/>
          <span className='text-gray-300'>Add Image(optional)</span>
          <input type="file" className='hidden' id='image' accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
        </label>

        {image && <div className='mt-3 '>
          <img src={URL.createObjectURL(image)} alt="" className='rounded-lg max-h-64 object-cover'/>
          </div>}
          <button disabled={!content || !channelData?._id || loading} className='w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium
          disabled:bg-gray-600 flex items-center justify-center' onClick={handleCreatePost}>
            {loading ? <ClipLoader color='black' size={20}/> : "Create Post"}</button>
      </div>
    </div>
  )
}

export default CreatePosts
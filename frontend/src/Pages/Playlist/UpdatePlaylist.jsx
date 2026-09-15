import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { showCustomAlert } from '../../components/CustomAlert.jsx'
import { serverUrl } from '../../App.jsx'
import { setChannelData } from '../../redux/userSlice.js'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'



function UpdatePlaylist() {
    const {playlistId} = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const {channelData} = useSelector(state=>state.user)
  const [videoData, setVideoData] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [playlist, setPlaylist] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(()=>{
    const fetchPlaylist = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/content/fetchplaylist/${playlistId}` , {withCredentials:true})
            
            setPlaylist(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description || "");
            setSelectedVideos((res.data.videos || []).map((v) => v._id))
        } catch (error) {
            console.error(error)
            showCustomAlert("Failed to load playlist");
        }
    }
    fetchPlaylist()
},[playlistId])

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev)=>prev.includes(videoId) ? prev.filter((id)=> id !== videoId): [...prev, videoId]
    )
  }

  const handleUpdate = async () => {
    if (!title) {
        showCustomAlert("Playlist title is required")
        return;
    }
    setLoading(true);
    try {
        const currentVideos = playlist.videos.map((p) => p._id.toString());
        const newVideos = selectedVideos.map((p) => p.toString())

        const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
        const removeVideos = currentVideos.filter((id) => !newVideos.includes(id));

        const res = await axios.post(`${serverUrl}/api/content/update-playlist/${playlistId}` , {
            title, description, addVideos, removeVideos
        } , {withCredentials:true})

        const updatedPlaylists = channelData.playlists.map((p) => p?._id === playlistId ? res.data : p)

        dispatch(setChannelData({...channelData, playlists: updatedPlaylists}))

        showCustomAlert("Playlist updated successfully")
        
    } catch (error) {
        console.error(error)
        showCustomAlert(error.response?.data?.message || "Failed to update playlist")
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you really want to delete this playlist")) return;

    setLoading1(true)
    try {
        await axios.delete(`${serverUrl}/api/content/delete-playlist/${playlistId}` , {withCredentials:true})

        const updatedPlaylists = channelData.playlists.filter((p) => p?._id !== playlistId)
        dispatch(setChannelData({...channelData, playlists: updatedPlaylists}))

        showCustomAlert("Playlist is deleted successfully");
        navigate("/streamilixstudio/content")
    } catch (error) {
        console.error(error);
        showCustomAlert(error.response?.message || "Failed to delete playlist")
        setLoading1(false)
    }
  }


  useEffect(()=>{
    if (channelData || channelData?.videos) {
      setVideoData(channelData?.videos)
      console.log(videoData);
      
    }
  },[])

  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <main className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#121212] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6'>
          <input type="text" className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white 
          focus:ring-2 focus:ring-orange-500 focus:outline-none' placeholder='Playlist title *' 
          onChange={(e)=>setTitle(e.target.value)} value={title}/>
          <textarea className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white 
          focus:ring-2 focus:ring-orange-500 focus:outline-none' placeholder='Playlist title *' 
          onChange={(e)=>setDescription(e.target.value)} value={description}/>

          <div>
            <p className='mb-3 text-lg font-semibold'>Select Videos</p>

            {videoData?.length === 0 ? (<p className='text-sm text-gray-400'>
              No videos found for this channel
            </p>):(<div className='grid grid-cols-2 gap-4 max-h-72 overflow-y-auto'>
              {videoData?.map((video)=>(
                <div key={video._id} className={`cursor-pointer rounded-lg overflow-hidden border-2 
                  ${selectedVideos.includes(video._id) ? "border-orange-500" : "border-gray-700"}`} 
                onClick={()=>toggleVideoSelect(video?._id)}>
                  <img src={video?.thumbnail} alt="" className='w-full h-28 object-cover'/>
                  <p className='p-2 text-sm truncate'>
                    {video?.title}
                  </p>
                </div>
              ))}
            </div>)}
          </div>
          <button disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 py-3 
          rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center' onClick={handleUpdate}>
            {loading ? <ClipLoader size={20} color='black'/> : "Update Playlist"}</button>
            <button disabled={loading1} className='w-full bg-orange-600 hover:bg-orange-700 py-3 
          rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center' onClick={handleDelete}>
            {loading1 ? <ClipLoader size={20} color='black'/> : "Delete Playlist"}</button>
        </div>
      </main>
    </div>
  )
}

export default UpdatePlaylist
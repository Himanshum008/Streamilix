import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App.jsx'
import { SiYoutubeshorts } from 'react-icons/si'
import ShortCard from '../components/ShortCard.jsx'
import { GoVideo } from 'react-icons/go'
import VideoCard from '../components/VideoCard.jsx'

const getVideoDuration = (url, callback) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
        const totalSeconds = Math.floor(video.duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };
    video.onerror = () =>{
        callback("0:00");
    };
};

function LikedContent() {
    const [likedVideo, setLikedVideo] = useState([])
    const [likedShort, setLikedShort] = useState([])
    const [duration, setDuration] = useState("")

    useEffect((
            ()=>{
                if(Array.isArray(likedVideo) && likedVideo.length > 0) {
                    likedVideo.forEach((videos)=>{
                      getVideoDuration(videos.videoUrl , (formattedTime)=>{
                        setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                      })  
                    }) 
                }
            }
        ),[likedVideo])

    useEffect(()=>{

        const fetchLikedContent = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/content/likedvideo" , {withCredentials:true})
                setLikedVideo(result.data)
                console.log(result.data);
                
                const result1 = await axios.get(serverUrl + "/api/content/likedshort" , {withCredentials:true})
                setLikedShort(result1.data)
                console.log(result1.data);
            } catch (error) {
                console.log(error);
                
            }
        }

        fetchLikedContent()
    },[])

    if ((!likedShort && !likedVideo) || (likedShort.length === 0 && likedVideo.length === 0)) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Liked Content Found
            </div>
        )
    }

    

  return (
    <div className='px-6 py-4 min-h-screen mt-12.5 lg:mt-5'>

        {likedShort.length > 0 && (
            <>
            <h2 className='text-2xl font-bold mb-6 pt-12.5 border-b border-gray-300 pb-2 flex items-center gap-1'>
                <SiYoutubeshorts className='w-7 h-7 text-orange-600'/>Liked Shorts
            </h2>
            <div className='flex flex-wrap gap-6'>
                {likedShort?.map((short)=>(
                    <div key={short?._id} className='shrink-0'>
                        <ShortCard
                        shortUrl={short?.shortUrl}
                        title={short?.title}
                        channelName={short?.channel?.name}
                        views={short?.views}
                        id={short?._id}
                        avatar={short?.channel?.avatar}
                        />
                    </div>
                ))}
            </div>
            </>
        )}

        {likedVideo.length > 0 && (
            <>
            <h2 className='text-2xl font-bold mb-6 pt-12.5 border-b border-gray-300 pb-2 flex items-center gap-1'>
                <GoVideo className='w-7 h-7 text-orange-600'/>Liked Videos
            </h2>
            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                {likedVideo?.map((video)=>(
                    <div key={video?._id} className='shrink-0'>
                        <VideoCard
                        thumbnail={video.thumbnail}
                        key={video._id}
                        duration={duration[video?._id] || "0:00"}
                        title={video?.title}
                        channelLogo={video?.channel.avatar}
                        channelName={video?.channel?.name}
                        id={video?._id}
                        views={video?.views}
                        />
                    </div>
                ))}
            </div>
            </>
        )}
    </div>
  )
}

export default LikedContent
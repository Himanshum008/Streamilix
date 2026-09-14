import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import VideoCard from '../components/VideoCard';
import { SiYoutubeshorts } from 'react-icons/si';
import ShortCard from '../components/ShortCard';

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


function RecommendedContent() {

    const {recommendedContent} = useSelector(state => state.user)
    const [duration, setDuration] = useState("")

    const allVideos = [
        ...(recommendedContent?.recommendedVideos || []),
        ...(recommendedContent?.remainingVideos || []),
    ];

    const allShorts = [
        ...(recommendedContent?.recommendedShorts || []),
        ...(recommendedContent?.remainingShorts || []),
    ];

    useEffect((
        ()=>{
            allVideos.forEach((videos)=>{
            getVideoDuration(videos.videoUrl , (formattedTime)=>{
            setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                })  
            })
        }    
    ),[recommendedContent])

    if (!allVideos.length && !allShorts.length) {
        return null;
    }

  return (
    <div className='px-6 py-4 mb-5'>

        {/* Video Section */}
        {allVideos.length > 0 && (
            <div>

                <div className='flex flex-wrap gap-6 mb-12'>
                    {allVideos.map((video)=>(
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
                    ))}
                </div>
            </div>
        )}


        {/* Short Section */}
        {allShorts.length > 0 && (
            <div className='mt-8'>

                <h3 className='text-xl font-bold mb-4 flex items-center gap-1'>
                    <SiYoutubeshorts className='w-6 h-6 text-orange-600'/>Shorts</h3>
                    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                    {allShorts.map((short)=>(
                        <div className='shrink-0' key={short._id}>
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
            </div>
        )}
    </div>
  )
}

export default RecommendedContent
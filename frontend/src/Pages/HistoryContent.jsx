import React, { useEffect, useState } from 'react'
import { SiYoutubeshorts } from 'react-icons/si'
import ShortCard from '../components/ShortCard.jsx'
import { GoVideo } from 'react-icons/go'
import VideoCard from '../components/VideoCard.jsx'
import { useSelector } from 'react-redux'

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

function HistoryContent() {
    const {historyVideo, historyShort} = useSelector(state=>state.user)
    const validHistoryVideo = historyVideo?.filter((item) => item?.contentId)
    const validHistoryShort = historyShort?.filter((item) => item?.contentId)

    const [duration, setDuration] = useState("")

    useEffect((
            ()=>{
                if(Array.isArray(historyVideo) && historyVideo.length > 0) {
                                        historyVideo.filter((item) => item?.contentId).forEach((v)=>{
                                                const videos = v?.contentId
                                                if (!videos?.videoUrl) return;

                                            getVideoDuration(videos.videoUrl , (formattedTime)=>{
                        setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                      })  
                    }) 
                }
            }
        ),[historyVideo])

    if ((!validHistoryVideo && !validHistoryShort) || ((validHistoryVideo?.length || 0) === 0 && (validHistoryShort?.length || 0) === 0)) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Content Found
            </div>
        )
    }

    

  return (
    <div className='px-6 py-4 min-h-screen mt-12.5 lg:mt-5'>

        {(validHistoryShort?.length || 0) > 0 && (
            <>
            <h2 className='text-2xl font-bold mb-6 pt-12.5 border-b border-gray-300 pb-2 flex items-center gap-1'>
                <SiYoutubeshorts className='w-7 h-7 text-orange-600'/>Shorts History
            </h2>
            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                {validHistoryShort?.map((s)=>{
                    const short = s?.contentId
                    return(
                    <div key={s?._id} className='shrink-0'>
                        <ShortCard
                        shortUrl={short?.shortUrl}
                        title={short?.title}
                        channelName={short?.contentId?.name}
                        views={short?.views}
                        id={short?._id}
                        avatar={short?.channel?.avatar}
                        createdAt={short?.createdAt}
                        />
                    </div>)
                })}
            </div>
            </>
        )}

        {(validHistoryVideo?.length || 0) > 0 && (
            <>
            <h2 className='text-2xl font-bold mb-6 pt-12.5 border-b border-gray-300 pb-2 flex items-center gap-1'>
                <GoVideo className='w-7 h-7 text-orange-600'/>Videos History
            </h2>
            <div className='flex flex-wrap gap-6'>
                {validHistoryVideo?.map((v)=>{
                    const video = v?.contentId
                    return(
                    <div key={v?._id} className='shrink-0'>
                        <VideoCard
                        thumbnail={video?.thumbnail}
                        key={video?._id}
                        duration={duration[video?._id] || "0:00"}
                        title={video?.title}
                        channelLogo={video?.channel?.avatar}
                        channelName={video?.channel?.name}
                        id={video?._id}
                        views={video?.views}
                        createdAt={video?.createdAt}
                        />
                    </div>)
})}
            </div>
            </>
        )}
    </div>
  )
}

export default HistoryContent
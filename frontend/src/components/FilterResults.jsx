import React, { useEffect, useState } from 'react'
import ChannelCard from './ChannelCard';
import VideoCard from './VideoCard';
import ShortCard from './ShortCard';
import PlaylistCard from './PlaylistCard';

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

function FilterResults({filterResults}) {
    const isEmpty = 
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) &&
    (!filterResults?.channels || filterResults.channels.length === 0) && 
    (!filterResults?.playlists || filterResults.playlists.length === 0);

    const [duration, setDuration] = useState("")
    
    useEffect((
        ()=>{
            if(Array.isArray(filterResults?.videos) && filterResults?.videos.length > 0) {
                filterResults?.videos.forEach((videos)=>{
                    getVideoDuration(videos.videoUrl , (formattedTime)=>{
                        setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                    })
                }) 
            }
        }
    ),[filterResults?.videos])

  return (
    <div className='px-6 py-4 bg-[#00000051] border border-gray-800 mb-5'>
        <h2 className='text 2xl font-bold mb-4'>Filter Results</h2>

        {isEmpty ? (
            <p className='text-gray-400 text-lg'>No Results Found</p>
        ):(
            <>

            {/* Videos Section */}
            {filterResults.videos?.length > 0 && (
                <div>
                    <h3 className='text-xl font-bold mb-4'>Videos</h3>
                    <div className='flex flex-wrap gap-6 mb-12'>
                        {filterResults.videos.map((video) => (
                            <VideoCard
                            thumbnail={video.thumbnail}
                            key={video._id}
                            duration={duration[video?._id] || "0:00"}
                            title={video?.title}
                            channelLogo={video?.channel?.avatar}
                            channelName={video?.channel?.name}
                            id={video?._id}
                            views={video?.views}
                            />
                        ))}
                    </div>
                </div>
            )}


            {/* Shorts Section */}
            {filterResults.shorts?.length > 0 && (
                <div className='mt-8'>
                    <h3 className='text-xl font-bold mb-4'>Shorts</h3>
                    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                        {filterResults.shorts.map((short) => (
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
            </>
        )}
    </div>
  )
}

export default FilterResults
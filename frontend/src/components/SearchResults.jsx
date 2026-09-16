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

function SearchResults({searchResults}) {
    const isEmpty = 
    (!searchResults?.videos || searchResults.videos.length === 0) &&
    (!searchResults?.shorts || searchResults.shorts.length === 0) &&
    (!searchResults?.channels || searchResults.channels.length === 0) && 
    (!searchResults?.playlists || searchResults.playlists.length === 0);

    const [duration, setDuration] = useState("")
    
    useEffect((
        ()=>{
            if(Array.isArray(searchResults?.videos) && searchResults?.videos.length > 0) {
                searchResults?.videos.forEach((videos)=>{
                    getVideoDuration(videos.videoUrl , (formattedTime)=>{
                        setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                    })
                }) 
            }
        }
    ),[searchResults?.videos])

  return (
    <div className='px-6 py-4 bg-[#00000051] border border-gray-800 mb-5'>
        <h2 className='text 2xl font-bold mb-4'>Search Results</h2>

        {isEmpty ? (
            <p className='text-gray-400 text-lg'>No Results Found</p>
        ):(
            <>

            {/* channel section */}
            {searchResults.channels?.length > 0 && (
                <div className='mb-12'>
                    <h3 className='text-xl font-bold mb-4'>Channels</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        {searchResults.channels.map((ch) => (
                            <ChannelCard
                            key={ch._id}
                            id={ch._id}
                            name={ch.name}
                            avatar={ch.avatar}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Videos Section */}
            {searchResults.videos?.length > 0 && (
                <div>
                    <h3 className='text-xl font-bold mb-4'>Videos</h3>
                    <div className='flex flex-wrap gap-6 mb-12'>
                        {searchResults.videos.map((video) => (
                            <VideoCard
                            thumbnail={video.thumbnail}
                            key={video._id}
                            duration={duration[video?._id] || "0:00"}
                            title={video?.title}
                            channelLogo={video?.channel?.avatar}
                            channelName={video?.channel?.name}
                            id={video?._id}
                            views={video?.views}
                            createdAt={video?.createdAt}
                            />
                        ))}
                    </div>
                </div>
            )}


            {/* Shorts Section */}
            {searchResults.shorts?.length > 0 && (
                <div className='mt-8'>
                    <h3 className='text-xl font-bold mb-4'>Shorts</h3>
                    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                        {searchResults.shorts.map((short) => (
                            <div className='shrink-0' key={short._id}>
                            <ShortCard
                            shortUrl={short?.shortUrl}
                            title={short?.title}
                            channelName={short?.channel?.name}
                            views={short?.views}
                            id={short?._id}
                            avatar={short?.channel?.avatar}
                            createdAt={short?.createdAt}
                            />
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Playlist section */}
            {searchResults.playlists?.length > 0 && (
                <div className='mt-8'>
                    <h3 className='text-xl font-bold mb-4'>Playlists</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        {searchResults.playlists.map((pl) => (
                            <PlaylistCard
                            key={pl._id}
                            id={pl._id}
                            title={pl.title}
                            videos={pl.videos}
                            savedBy={pl.saveBy}
                            />
                        ))}
                    </div>
                </div>
            )}
            </>
        )}
    </div>
  )
}

export default SearchResults
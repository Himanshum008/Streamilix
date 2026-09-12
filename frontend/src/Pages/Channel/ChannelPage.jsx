import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../../App.jsx'
import { ClipLoader } from 'react-spinners'
import VideoCard from '../../components/VideoCard.jsx'
import ShortCard from '../../components/ShortCard.jsx'
import PlaylistCard from '../../components/PlaylistCard.jsx'
import PostCard from '../../components/PostCard.jsx'

const getVideoDuration = (url, callback) => {
    const video = document.createElement("Videos");
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

function ChannelPage() {
    const {channelId} = useParams()
    const {allChannelData, userData} = useSelector(state=>state.user)
    const channelData = allChannelData?.find((c)=>String(c._id) === String(channelId))

    const [channel, setChannel] = useState(channelData)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("videos")
    const [isSubscribed, setIsSubscribed] = useState(channel?.subscribers?.some((sub)=>sub?._id?.toString() 
        === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()))

    const [duration, setDuration] = useState("")

    useEffect((
        ()=>{
            if(Array.isArray(channel?.videos) && channel?.videos.length > 0) {
                channel?.videos.forEach((videos)=>{
                  getVideoDuration(videos.videoUrl , (formattedTime)=>{
                    setDuration((prev)=>({...prev , [videos._id] : formattedTime}))
                  })  
                }) 
            }
        }
    ),[channel?.videos])

    const handleSubscribe = async () => {
        if (!channel._id) {
            return;
        }
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/user/togglesubscribe" , 
                {channelId:channel._id} , {withCredentials:true})
                setChannel((prev)=>({
                    ...prev , subscribers:result.data.subscribers || prev.subscribers
                }))
                setLoading(false)
                console.log(result.data);
                
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(()=>{setIsSubscribed(channel?.subscribers?.some((sub)=>sub._id?.toString() 
            === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()))
        }),[channel?.subscribers , userData?._id]
    

  return (

    <div className='text-white min-h-screen pt-2.5'>
        {/* banner */}
        <div className='relative'>
            <img src={channel?.banner} alt="" className='w-full h-60 object-cover '/>
            <div  className='absolute insert-0 bg-linear-to-t from-black/70 to-transparent'></div>
        </div>

        {/* Channel Info */}
        <div className='relative flex items-center gap-6 p-6 rounded-xl bg-linear-to-r from-gray-900 via-black to-gray-900
        shadow-xl flex-wrap'>
            <div>
            <img src={channel?.avatar} alt="" className='rounded-full w-28 h-28 border-4 border-gray-800 shadow-lg hover:scale-105 
            hover:ring-4 hover:ring-orange-600 transition-transform duration-300'/>
            </div>
        
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold tracking-wide'>
                {channel?.name}
            </h1>
            <p className='text-gray-400 mt-1'>
                <span className='font-semibold text-white'>{channel?.subscribers?.length}</span>{" "}Subscriber. {" "}
                <span className='font-semibold text-white'>{channel?.videos?.length}</span>{" "}Videos
            </p>
            <p className='text-gray-300 text-sm mt-2 line-clamp-2'>{channel?.category}</p>
            
        </div>
        <button className={`px-5 py-2 rounded-4xl border border-gray-600 ml-5 text-md 
        ${isSubscribed ? "bg-black text-white hover:bg-orange-600 hover:text-black ": 
        "bg-white text-black hover:bg-orange-600 hover:text-black"} `} onClick={handleSubscribe} disabled={loading}>
        {loading?<ClipLoader size={20} color='orange4'/>: isSubscribed ? "Subscribed" : "Subscribe"}</button>
    </div>

    {/* tab */}
    <div className='flex gap-8 px-6 border-b border-gray-800 mb-6 relative'>
        {["Videos" , "Shorts" , "Playlists" , "Community"].map((tab)=>(
            <button key={tab} className={`pb-3 relative font-medium transition ${activeTab === tab ? "text-white" :
                "text-gray-400 hover:text-white"}`} onClick={()=>setActiveTab(tab)}
            >{tab}{activeTab===tab && <span className='absolute bottom-0 left-0 right-0 
                h-0.5 bg-orange-600 rounded-full'></span>}</button>

        ))}
    </div>
    <div className='px-6 space-y-8'>
        {activeTab === "Videos" && (
            <div className='flex flex-wrap gap-5 pb-10'>
        {channel.videos?.map((v)=>(
            <VideoCard
            key={v._id}
            id={v._id}
            thumbnail={v.thumbnail}
            duration={duration[v?._id] || "0:00"}
            channelLogo={channel.avatar}
            title={v.title}
            channelName={channel.name}
            views={v.views}
            />
        ))}
    </div>
    )}

    {activeTab === "Shorts" && (
        <div className='flex gap-4 flex-wrap'>
            {channel.shorts?.map((short) => (
                <ShortCard 
                key={short._id}
                id={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.name}
                views={short.views}
                avatar={channel.avatar}
                />
            ))}
        </div>
    )}
    
    {activeTab === "Playlists" && (
        <div className='flex gap-5 flex-wrap'>
            {channel.playlists?.map((p) => (
                <PlaylistCard 
                key={p._id}
                id={p._id}
                title={p.title}
                videos={p.videos}
                savedBy={p.saveBy}
                channelAvatar={channel.avatar}
                channelName={channel.name}
                />
            ))}
        </div>
    )}

    {activeTab === "Community" && (
        <div className='flex gap-5 flex-wrap'>
            {channel.communityPosts?.map((p) => (
                <PostCard 
                key={p._id}
                post={p}
                />
            ))}
        </div>
    )}
    </div>
</div>
  )
}

export default ChannelPage
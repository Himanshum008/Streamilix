import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    FaPlay,
    FaPause, 
    FaThumbsUp, 
    FaThumbsDown, 
    FaDownload, 
    FaBookmark,
    FaComment,
    FaArrowDown,
} from 'react-icons/fa'
import Description from '../../components/Description.jsx'
import axios from 'axios'
import { serverUrl } from '../../App.jsx'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'

const IconButton = ({icon:Icon, active, label, count, onClick})=>(
    <button className='flex flex-col items-center' onClick={onClick}>
        <div className={`${active ? "bg-white" : "bg-[#00000065] border border-gray-700"} 
        p-3 rounded-full hover:bg-gray-700 transition`}>
            <Icon size={18} className={`${active ? "text-black" : "text-white"}`}/>
            
        </div>
        <span className='text-xs mt-1 flex gap-1'>{count !== undefined && `${count}`} <span>{label}</span></span>
    </button>
)

const ExpandableText = ({text, className = ""}) => {
  const textRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    setHasOverflow(element.scrollHeight > element.clientHeight)
  }, [text])

  return (
    <div className={className}>
      <p
        ref={textRef}
        className={`whitespace-pre-line ${expanded ? "" : "line-clamp-1"}`}
        style={{overflowWrap: "anywhere"}}
      >
        {text}
      </p>
      {hasOverflow && (
        <button
          className='text-xs text-blue-400 hover:underline'
          onClick={() => setExpanded((previous) => !previous)}
        >
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  )
}

const ExpandableTags = ({tags = []}) => {
  const tagsRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const element = tagsRef.current
    if (!element) return

    setHasOverflow(element.scrollHeight > element.clientHeight)
  }, [tags])

  return (
    <div>
      <div
        ref={tagsRef}
        className={`flex flex-wrap gap-1 overflow-hidden ${expanded ? "" : "max-h-7"}`}
      >
        {tags.map((tag) => (
          <span key={tag} className='bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full'>
            {tag}
          </span>
        ))}
      </div>
      {hasOverflow && (
        <button
          className='text-xs text-blue-400 hover:underline'
          onClick={() => setExpanded((previous) => !previous)}
        >
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  )
}

const sortCommentsByNewest = (comments = []) => [...comments]
  .map((comment) => ({
    ...comment,
    replies: [...(comment?.replies || [])].sort(
      (firstReply, secondReply) =>
        new Date(secondReply?.createdAt || 0) - new Date(firstReply?.createdAt || 0)
    )
  }))
  .sort(
    (firstComment, secondComment) =>
      new Date(secondComment?.createdAt || 0) - new Date(firstComment?.createdAt || 0)
  )

function Shorts() {
  const {allShortsData} = useSelector(state=>state.content)
  const {userData} = useSelector(state=>state.user)

  const [shortList, setShortList] = useState([])
  const shortRefs = useRef([])
  const [playIndex, setPlayIndex] = useState(null)
  const [openComment, setOpenComment] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewedShort, setViewedShort] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [replyCommentId, setReplyCommentId] = useState(null)
  const [replyText, setReplyText] = useState({})
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)

  const isChannelSubscribed = (channel) => {
    if (!channel?.subscribers || !userData?._id) return false

    return channel.subscribers.some((sub) => {
      const subscriberId = sub?.user?._id?.toString()
        || sub?.user?.toString()
        || sub?._id?.toString()
        || sub?.toString()

      return subscriberId === userData._id.toString()
    })
  }
  

  useEffect(()=>{
    const observer = new IntersectionObserver((entries)=> {
    entries.forEach((entry)=>{
      const index = Number(entry.target.dataset.index)
      const video = shortRefs.current[index]
      if (video) {
        if (entry.isIntersecting) {
          video.muted = false,
          video.play()
          setActiveIndex(index)

          const currentShortId = shortList[index]._id
          if(!viewedShort.includes(currentShortId)){
            handleAddView(currentShortId)
            setViewedShort((prev)=>[...prev , currentShortId])
          }
        }
        else{
          video.muted = true
          video.pause()
        }
      }
    })},{threshold: 0.7})
    
    shortRefs.current.forEach((video)=>{
      if(video) observer.observe(video)
    })
  return ()=>observer.disconnect()
  },[shortList])

  const togglePlay = (index) => {
    const video = shortRefs.current[index]
    if (!video) return

    if (video.paused) {
      video.play()
      setPlayIndex(null)
    }else{
      video.pause()
      setPlayIndex(index)
    }
  }

  const handleSubscribe = async (channelId) => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/togglesubscribe" , {channelId} , {withCredentials:true})

      setLoading(false)
      console.log(result.data);
      
      const updatedChannel = result.data
      setShortList((prev)=>prev.map((short)=>short?.channel?._id === channelId ? {...short , channel :updatedChannel} : short))
    } catch (error) {
      console.log(error);
      
      setLoading(false)
    }
  }

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-like` , {} , {withCredentials:true})
      const updatedShort = result.data
      setShortList((prev)=>prev.map((short)=>short?._id === updatedShort?._id ? updatedShort : short))
      console.log(result.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const toggleDislike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-dislike` , {} , {withCredentials:true})
      const updatedShort = result.data
      setShortList((prev)=>prev.map((short)=>short?._id === updatedShort?._id ? updatedShort : short))
      console.log(result.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-save` , {} , {withCredentials:true})
      const updatedShort = result.data
      setShortList((prev)=>prev.map((short)=>short?._id === updatedShort?._id ? updatedShort : short))
      console.log(result.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleAddView = async (shortId) => {
    try {
      await axios.put(`${serverUrl}/api/content/short/${shortId}/add-view` , {} , {withCredentials:true})
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleAddComment = async (shortId) => {
      if(!newComment)return;
        try{
            const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/add-comment` , 
                {message:newComment} , {withCredentials:true})
                setComments((prev)=>({
                  ...prev , [shortId]: sortCommentsByNewest(result.data?.comments),
                }))
                console.log(result.data?.comments);
                setNewComment("")
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddReply = async ({commentId , replyText , shortId}) => {
    if(!replyText)return;

        try {
            const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/${commentId}/add-reply` , 
                {message:replyText} , {withCredentials:true})
                setComments((prev)=>({
                  ...prev , [shortId]: sortCommentsByNewest(result.data?.comments),
                }))
                setReplyText((prev)=>({
                        ...prev , [commentId]: ""
                      }))
                console.log(result.data?.comments);
        } catch (error) {
            console.log(error);
        }
  }

  useEffect(()=>{
    if (!allShortsData || allShortsData.length === 0) return;

    const shuffled = [...allShortsData].sort(()=>Math.random() - 0.5);
    setShortList(shuffled)
  },[allShortsData])

  useEffect(()=>{
            const addHistory = async () => {
                try {
                  const shortId = shortList[activeIndex]?._id
                  console.log(shortId);
                  
                  if (!shortId) return;
                    const res = await axios.post(`${serverUrl}/api/user/add-history` , {contentId: shortId, contentType: "Short"} ,
                        {withCredentials:true}
                    )
                    console.log(res.data);
                    
                } catch (error) {
                    console.error("Error adding short history", error)
                }
            }
    
            if (shortList.length > 0) addHistory();
        },[activeIndex , shortList])

  return (
    <div className='h-[calc(100vh-3.75rem)] w-full overflow-y-scroll snap-y snap-mandatory'>
      {shortList.map((short , index)=>(
        <div key={short?._id} className='min-h-full w-full flex items-start justify-center pt-9
        snap-start'>
          <div className='relative h-[calc(100vh-7rem)] md:h-[calc(100vh-6rem)] w-full md:w-auto aspect-9/16 bg-black rounded-2xl overflow-hidden shadow-xl border 
          border-gray-700 cursor-pointer' onClick={()=>togglePlay(index)}>
            <video
            ref={(el)=>(shortRefs.current[index] = el)}
            data-index = {index}
            src={short?.shortUrl}
            className='w-full h-full object-cover'
            loop
            playsInline/>
            {
            playIndex === index && (
              <div className='absolute top-3 right-3 bg-black/60 rounded-full p-2'>
                <FaPlay className='text-white text-lg'/>
              </div>
            )
          }

          {
            playIndex !== index && (
              <div className='absolute top-3 right-3 bg-black/60 rounded-full p-2'>
                <FaPause className='text-white text-lg'/>
              </div>
            )
          }

          <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 
          via-black/40 to-transparent text-white space-y-1'>
            <div className='flex items-center justify-start gap-2'>
              <img src={short?.channel?.avatar} className='w-8 h-8 rounded-full border border-gray-700' 
              onClick={()=>navigate(`/channelpage/${short?.channel?._id}`)}/>
              <span className='text-sm text-gray-300' onClick={()=>navigate(`/channelpage/${short?.channel?._id}`)}>
                @{short?.channel?.name?.toLowerCase()}</span>
              <div>
              <button className={`${isChannelSubscribed(short?.channel) ? 
              "bg-[#000000a1] text-white border border-gray-700" : "bg-white text-black"} 
              text-xs px-2.5 py-2.5 rounded-full cursor-pointer`}
              onClick={()=>handleSubscribe(short?.channel?._id)} disabled={loading}>
                {loading ? <ClipLoader size={20} color='gray'/> : 
                isChannelSubscribed(short?.channel)?"Subscribed" : "Subscribe"}</button></div>
            </div>
            <div className='flex items-center justify-start'>
              <h3 className='font-bold text-lg line-clamp-2'>{short?.title}</h3>
            </div>
            <ExpandableTags tags={short?.tags}/>
            <Description text={short?.description}/>
          </div>
          <div className='absolute right-3 bottom-28 flex flex-col items-center gap-2 text-white'>
            <IconButton icon={FaThumbsUp} label={"Likes"} 
            active={short?.likes?.includes(userData._id)} count={short?.likes?.length} onClick={()=>toggleLike(short?._id)}/>
            <IconButton icon={FaThumbsDown} label={"Dislikes"}
            active={short?.dislikes?.includes(userData._id)} count={short?.dislikes?.length} onClick={()=>toggleDislike(short?._id)}/>
            <IconButton icon={FaComment} label={"Comment"} onClick={()=>{setOpenComment(!openComment);
              setComments((prev)=>({...prev, [short._id] :sortCommentsByNewest(short.comments)}))}}/>
            <IconButton icon={FaDownload} label={"Download"} onClick={()=>{
            const link = document.createElement("a"); link.href = short?.shortUrl; 
            link.download = `${short?.title}.mp4`; link.click();}}/>   
            <IconButton icon={FaBookmark} label={"Save"} 
            active={short?.saveBy?.includes(userData._id)} onClick={()=>toggleSave(short?._id)}/>
          </div>

          {
            openComment && (<div className='absolute bottom-0 left-0 right-0 h-[60%] bg-black/85 
            text-white p-4 rounded-t-2xl overflow-y-auto'>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='font-bold text-lg'>Comments</h3>
                <button ><FaArrowDown size={20} onClick={()=>setOpenComment(!openComment)} className='cursor-pointer hover:bg-orange-400 rounded-xl'/></button>
              </div>
              <div className='mt-4 flex w-full max-w-2xl gap-2'>
                <input type="text" placeholder='Add a comment....' className='min-w-0 h-10 flex-1 bg-gray-900 text-white p-2 rounded' 
                onChange={(e)=>setNewComment(e.target.value)} value={newComment}/>
                <button className='shrink-0 h-10 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg' disabled={loading}
                onClick={handleAddComment}>{loading ? <ClipLoader size={20} color='black'/>:"Post"}</button>
              </div>
              <div className='space-y-3 mt-4'>
                {comments[short._id]?.length > 0 ?
                comments[short._id].map((comment)=>(
                  <div key={comment?._id} className='bg-gray-800/40 p-2 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <img src={comment?.author?.photoUrl} alt="" className='w-6 h-6 rounded-full'/>
                      <h3 className='text-sm font-semibold'>{comment?.author?.username}</h3>
                    </div>
                    <ExpandableText text={comment?.message} className='ml-8 text-sm'/>
                    <button className='text-md text-orange-500' onClick={()=>setReplyCommentId(
                      replyCommentId === comment?._id ? null : comment?._id
                    )}>reply</button>

                    {replyCommentId === comment?._id && <div className='mt-2 ml-8 flex w-full max-w-xl gap-2'>
                      <input type="text" className='min-w-0 h-9 flex-1 text-white text-sm p-2 rounded' placeholder='Add a reply...' 
                      onChange={(e)=>setReplyText((prev)=>({
                        ...prev , [comment._id]: e.target.value
                      }))} value={replyText[comment._id] || ""}/>
                      <button className='h-9 shrink-0 bg-orange-500 px-2 py-1 rounded text-xs' 
                      onClick={()=>{
                        handleAddReply({shortId:short._id , commentId:comment._id, replyText:replyText[comment._id]});
                        setReplyText((prev)=>({
                        ...prev , [comment._id]: ""}))}}>Reply</button>
                    </div>
                    }
                    {replyCommentId === comment?._id && <div className='ml-5 mt-2 space-y-2'>
                      {comment?.replies.map((reply)=>(
                        <div key={reply?._id} className='bg-gray-800/40 p-2 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <img src={reply?.author?.photoUrl} alt="" className='w-6 h-6 rounded-full'/>
                      <h3 className='text-sm font-semibold'>{reply?.author?.username}</h3>
                    </div>
                    <ExpandableText text={reply?.message} className='ml-8 text-sm'/>
                    </div>
                      ))}
                    </div>}
                  </div>
                )) : <p className='text-sm text-gray-400'>No comments yet.</p>}
              </div>
            </div>
          )}
          </div>
          
        </div>
      ))}
    </div>
  )
}

export default Shorts;
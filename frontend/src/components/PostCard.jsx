import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { FaHeart, FaComment, FaReply, FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App.jsx'
import { ClipLoader } from 'react-spinners'
import { timeAgo } from '../../../backend/src/utils/timeAgo.js'

const sortCommentsWithReplies = (comments = []) => [...comments]
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

const ExpandableText = ({text, className = ""}) => {
    const textRef = React.useRef(null)
    const [expanded, setExpanded] = useState(false)
    const [hasOverflow, setHasOverflow] = useState(false)

    React.useEffect(() => {
        const element = textRef.current
        if (!element) return

        setHasOverflow(element.scrollHeight > element.clientHeight)
    }, [text])

    return (
        <div className={className}>
            <p ref={textRef} className={`whitespace-pre-line ${expanded ? "" : "line-clamp-1"}`} style={{overflowWrap: "anywhere"}}>
                {text}
            </p>
            {hasOverflow && (
                <button className='text-xs text-blue-400 hover:underline' onClick={()=>setExpanded((previous)=>!previous)}>
                    {expanded ? "show less" : "show more"}
                </button>
            )}
        </div>
    )
}

function PostCard({post}) {
    const {userData} = useSelector(state=>state.user)
    const [liked, setLiked] = useState(post.likes?.some((u)=>u.toString() === userData?._id?.toString()) || false)
    const [likedCount, setLikedCount] = useState(post.likes?.length)
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [comments, setComments] = useState(sortCommentsWithReplies(post?.comments))

    const handleLike = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/content/post/toggle-like` , 
                {postId:post._id} , {withCredentials:true})
            setLikedCount(result.data.likes?.length)
            setLiked(result.data.likes.includes(userData?._id))
            console.log(result.data);
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleAddComment = async () => {
        if(!newComment)return;
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/content/post/add-comment` , 
                {message:newComment , postId:post?._id} , {withCredentials:true})
                setComments(sortCommentsWithReplies(result.data?.comments))
                console.log(result.data?.comments);
                setLoading(false)
                setNewComment("")
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const handleAddReply = async ({replyText , commentId}) => {
        if(!replyText)return;
        setLoading1(true)
        try {
            const result = await axios.post(`${serverUrl}/api/content/post/add-reply` , 
                {message:replyText , postId:post?._id , commentId} , {withCredentials:true})
                setComments(sortCommentsWithReplies(result.data?.comments))
                console.log(result.data?.comments);
                setLoading1(false)
                
        } catch (error) {
            console.log(error);
            setLoading1(false)
        }
    }

  return (
    <div className='w-100 bg-linear-to-br from-gray-900 via-black 
    to-gray-900 rounded p-5 shadow-lg border border-gray-700 mb-12.5 relative'> 
    <p className='text-base text-gray-200'>{post.content}</p>
    {post?.image && (
        <img src={post?.image} alt="" className='w-90 h-80 object-cover rounded-xl mt-4 shadow-md'/>
    )}
    <div className='flex justify-between items-center mt-4 text-gray-400 text-sm'>
        <span className='italic text-gray-500'>
            {new Date(post.createdAt).toDateString()}
        </span>
        <div className='flex gap-6'>
            <button 
            className={`flex items-center gap-2 cursor-pointer transition ${liked ? 
                "text-red-500" : "hover:text-red-400"}`}
            onClick={handleLike}><FaHeart/>{likedCount}</button>
            <button className='flex items-center gap-2 hover:text-orange-400 cursor-pointer transition'
            onClick={()=>setShowComments(true)}><FaComment/></button>
        </div>
    </div>

    {showComments && (
        <div className='absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[70%] overflow-y-auto space-y-2'>
            <div className='top-0 z-10 flex items-center w-full justify-between bg-gray-900/95 py-2.5 backdrop-blur-md'>
                <h3  className='text-gray-300 font-semibold mb-2'>Comments</h3>
                <button className='text-gray-400 hover:bg-orange-500 transition' 
                onClick={()=>setShowComments(!comments)}><FaTimes size={18}/></button>
            </div>
            
            <div className='flex w-full max-w-2xl gap-2 mt-3 items-center'>
                <img src={userData?.photoUrl} alt="" className='w-8 h-8 rounded-full'/>
                <input type="text" onChange={(e)=>setNewComment(e.target.value)} value={newComment}
                className='min-w-0 h-10 flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm 
                focus:outline-none focus:ring-2 focus:ring-orange-500' placeholder='Add a comment....'/>
                <button disabled={loading} className='h-10 shrink-0 px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700'
                onClick={handleAddComment}>{loading ? <ClipLoader size={20} color='black'/>:"Post"}</button>
            </div>

            <div className='space-y-3'>
                {comments.length > 0 ? (
                    comments?.map((comment)=>(
                     <div key={comment?._id} className='bg-gray-700 p-3 rounded-lg'>
                        <div className='flex items-center gap-2 mb-1'>
                            <img src={comment?.author?.photoUrl} alt="" className='w-6 h-6 rounded-full'/>
                            <span className='text-sm font-semibold text-gray-200'>{comment?.author?.username}</span>    
                        </div>
                        <ExpandableText text={comment?.message} className='ml-8 text-gray-200'/>

                        <ReplySection comment={comment} replies={comment?.replies} handleReply={handleAddReply} loading1={loading1}/>

                    </div>   
                    ))) 
                : (<p className='text-gray-500 text-sm'>No comments yet</p>)}
            </div>

        </div>
    )}

    
    </div>
  )
}

const ReplySection = ({comment, replies = [], handleReply, loading1})=>{
    const [replyText, setReplyText] = useState("")
    const [showReplyInput, setShowReplyInput] = useState(false)

    return(
        <div className='mt-3'>
            {showReplyInput && 
            <div className='flex w-full max-w-xl gap-2 mt-1 ml-0 sm:ml-4'>
                <input type="text" 
                placeholder='Add a reply...!' 
                className='flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:ring-1 
                min-w-0 h-9 focus:ring-orange-600 text-sm' 
                onChange={(e)=>setReplyText(e.target.value)} value={replyText}/>
                <button onClick={()=>{handleReply({commentId:comment._id , replyText:replyText}); 
                setShowReplyInput(false); setReplyText("")}} disabled={loading1}
                    className='shrink-0 h-9 bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm'>
                        {loading1 ? <ClipLoader color='black'/> : "Reply"}</button>
            </div>}

            <button onClick={()=>setShowReplyInput(!showReplyInput)} className='ml-4 text-xs text-gray-400 mt-1'>reply</button>

            {showReplyInput && <div className='ml-4 mt-2 space-y-2'>
                {replies.map((reply)=>(
                    <div key={reply?._id} className='p-2 bg-[#2a2a2a] rounded'>
                        <div className='flex items-center justify-start gap-1'>
                            <img src={reply?.author?.photoUrl} alt='' className='w-6 h-6 rounded-full object-cover'/>
                            <h2 className='text-[13px]'>{reply?.author?.username}</h2>
                            <span className='text-[11px] text-gray-500'>{timeAgo(reply?.createdAt)}</span>
                        </div>
                        <ExpandableText text={reply?.message} className='ml-8 text-gray-200'/>
                    </div>
                ))}
            </div>}

        </div>
    )
}

export default PostCard
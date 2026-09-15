import axios from 'axios'
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App.jsx'
import { setChannelData } from '../redux/userSlice.js'
import { showCustomAlert } from './CustomAlert'

function Content() {
  const {channelData} = useSelector(state=>state.user)

  const[activeTab, setActiveTab] = useState("Videos")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you really want to delete this post")) return;

    try {
      await axios.delete(`${serverUrl}/api/content/delete-post/${postId}` , {withCredentials:true})

      const updatedPosts = channelData.communityPosts.filter(
        (p) => p._id !== postId
      )
      dispatch(setChannelData({...channelData, communityPosts: updatedPosts}));

      showCustomAlert("Post deleted successfully")
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to delete post")
    }
  }

  return (
    <div className='text-white min-h-screen pt-5 px-4 sm:px-6 mb-16'>
      <div className='flex flex-wrap gap-6 border-b border-gray-800 mb-6'>
        {["Videos" , "Shorts" , "Playlists" , "Community"].map((tab)=>(
            <button key={tab} className={`pb-3 relative font-medium transition ${activeTab === tab ? "text-white" :
                "text-gray-400 hover:text-white"}`} onClick={()=>setActiveTab(tab)}
            >{tab}{activeTab===tab && <span className='absolute bottom-0 left-0 right-0 
                h-0.5 bg-orange-600 rounded-full'></span>}</button>

        ))}
      </div>

      <div className='space-y-8'>

        {/* For Videos */}

        {activeTab === "Videos" && (
          <div>
          <div className='hidden md:block overflow-x-auto'>
            <table className='min-w-full border border-gray-700 rounded-lg'>
              <thead className='bg-gray-800 text-sm'>
                <tr>
                  <th className='p-3 text-left'>Thumbnail</th>
                  <th className='p-3 text-left'>Title</th>
                  <th className='p-3 text-left'>Viwes</th>
                  <th className='p-3 text-left'>Edit</th>
                </tr>
              </thead>

              <tbody>
                {channelData?.videos?.map((v)=>(
                  <tr key={v?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                    <td className='p-3'>
                      <img src={v?.thumbnail} alt="" className='w-20 h-12 rounded object-cover'/>
                    </td>
                    <td className='p-3 text-start'>{v?.title}</td>
                    <td className='p-3 text-start'>{v?.views}</td>
                    <td className='p-3'><FaEdit className='cursor-pointer hover:text-orange-400' 
                    onClick={()=>navigate(`/streamilixstudio/updatevideo/${v._id}`)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='grid gap-4 md:hidden'>
            {channelData.videos?.map((v)=>(
              <div key={v._id}
              className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col'>
                <img src={v.thumbnail} alt={v.title} className='w-full h-40 object-cover'/>
                <div className='flex-1 p-4'>
                  <h3 className='text-base font-semibold'>{v.title}</h3>
                </div>
                <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                  <span>{v.views} views</span>
                  <FaEdit className='cursor-pointer hover:text-orange-400' 
                  onClick={()=>navigate(`/streamilixstudio/updatevideo/${v._id}`)}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* For Shorts */}

        {activeTab === "Shorts" && (
          <div>
          <div className='hidden md:block overflow-x-auto'>
            <table className='min-w-full border border-gray-700 rounded-lg'>
              <thead className='bg-gray-800 text-sm'>
                <tr>
                  <th className='p-3 text-left'>Preview</th>
                  <th className='p-3 text-left'>Title</th>
                  <th className='p-3 text-left'>Viwes</th>
                  <th className='p-3 text-left'>Edit</th>
                </tr>
              </thead>

              <tbody>
                {channelData?.shorts?.map((s)=>(
                  <tr key={s?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                    <td className='p-3'>
                      <video src={s?.shortUrl} className='w-16 h-24 bg-black rounded' muted playsInline/>
                    </td>
                    <td className='p-3 text-start'>{s?.title}</td>
                    <td className='p-3 text-start'>{s?.views}</td>
                    <td className='p-3'><FaEdit className='cursor-pointer hover:text-orange-400' 
                    onClick={()=>navigate(`/streamilixstudio/updateshort/${s._id}`)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='grid gap-4 md:hidden border'>
            {channelData.shorts?.map((s)=>(
              <div key={s._id}
              className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col'>
                <video src={s?.shortUrl} className='w-full  aspect-9/16 object-covered' muted playsInline controls/>
                <div className='flex-1 p-4'>
                  <h3 className='text-base font-semibold'>{s.title}</h3>
                </div>
                <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                  <span>{s.views} views</span>
                  <FaEdit className='cursor-pointer hover:text-orange-400' onClick={()=>navigate(`/streamilixstudio/updateshort/${s._id}`)}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}


        {/* For Playlists */}

        {activeTab === "Playlists" && (
          <div>
          <div className='hidden md:block overflow-x-auto'>
            <table className='min-w-full border border-gray-700 rounded-lg'>
              <thead className='bg-gray-800 text-sm'>
                <tr>
                  <th className='p-3 text-left'>Preview</th>
                  <th className='p-3 text-left'>Title</th>
                  <th className='p-3 text-left'>Total Videos</th>
                  <th className='p-3 text-left'>Edit</th>
                </tr>
              </thead>

              <tbody>
                {channelData?.playlists?.map((v)=>(
                  <tr key={v?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                    <td className='p-3'>
                      <img src={v?.videos?.[0]?.thumbnail || ''} alt="" className='w-20 h-12 rounded object-cover'/>
                    </td>
                    <td className='p-3 text-start'>{v?.title}</td>
                    <td className='p-3 text-start'>{v?.videos?.length || 0}</td>
                    <td className='p-3'><FaEdit className='cursor-pointer hover:text-orange-400' 
                    onClick={()=>navigate(`/streamilixstudio/updateplaylist/${v._id}`)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='grid gap-4 md:hidden border'>
            {channelData.playlists?.map((v)=>(
              <div key={v._id}
              className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col'>
                <img src={v?.videos?.[0]?.thumbnail || ''} alt="" className='w-full h-32 object-cover'/>
                <div className='flex-1 p-4'>
                  <h3 className='text-base font-semibold'>{v.title}</h3>
                </div>
                <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                  <span>{v.videos?.length || 0}</span>
                  <FaEdit className='cursor-pointer hover:text-orange-400' onClick={()=>navigate(`/streamilixstudio/updateplaylist/${v._id}`)}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}


        {/* For community posts */}

        {activeTab === "Community" && (
          <div>
          <div className='hidden md:block overflow-x-auto'>
            <table className='min-w-full border border-gray-700 rounded-lg'>
              <thead className='bg-gray-800 text-sm'>
                <tr>
                  <th className='p-3 text-left'>Image</th>
                  <th className='p-3 text-left'>Post</th>
                  <th className='p-3 text-left'>Date</th>
                  <th className='p-3 text-left'>Delete</th>
                </tr>
              </thead>

              <tbody>
                {channelData?.communityPosts?.map((p)=>(
                  <tr key={p?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                    <td className='p-3'>
                      <img src={p?.image} alt="" className='w-20 h-12 rounded object-cover'/>
                    </td>
                    <td className='p-3 text-start'>{p?.content}</td>
                    <td className='p-3 text-start'>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className='p-3'><MdDelete size={20} className='cursor-pointer hover:text-orange-400' 
                    onClick={()=>handleDeletePost(p?._id)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='grid gap-4 md:hidden'>
            {channelData.communityPosts?.map((p)=>(
              <div key={p._id}
              className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col'>
                <img src={p.image} alt="" className='w-full h-40 object-cover'/>
                <div className='flex-1 p-4'>
                  <h3 className='text-base font-semibold'>{p.content}</h3>
                </div>
                <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  <MdDelete size={20} className='cursor-pointer hover:text-orange-400' onClick={()=>handleDeletePost(p?._id)}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default Content
import React, { useRef, useState } from 'react'
import CustomAlert, { showCustomAlert } from '../components/CustomAlert.jsx'
import icon from "../assets/icon.png"
import { 
  FaSearch, 
  FaUserCircle,
  FaMicrophone,
  FaBars,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaTimes,
 } from 'react-icons/fa'
import { IoIosAddCircle } from "react-icons/io"
import { GoVideo } from "react-icons/go"
import { SiYoutubeshorts } from "react-icons/si"
import { MdOutlineSubscriptions } from "react-icons/md"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Profile from '../components/Profile.jsx'
import AllVideosPage from '../components/AllVideosPage.jsx'
import AllShortsPage from '../components/AllShortsPage.jsx'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { ClipLoader } from 'react-spinners'
import SearchResults from '../components/SearchResults.jsx'
import RecommendedContent from './RecommendedContent.jsx'
import FilterResults from "../components/FilterResults.jsx";


function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState("Home")
  const [active, setActive] = useState("Home")
  const navigate = useNavigate()
  const {userData, subscribedChannels} = useSelector((state)=>state.user)
  const [popUp, setPopUp] = useState(false)
  const [searchPopUp, setSearchPopUp] = useState(false)
  const location = useLocation()
  const isShortsPage = location.pathname.startsWith('/shorts') || location.pathname.startsWith('/playshort')
  const [listening, setListening] = useState()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState("")
  const [loading1, setLoading1] = useState(false)
  const [filterData, setFilterData] = useState("")


  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const recognitionRef = useRef()

  if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
  }

  const handleSearch = async () => {
    if (!recognitionRef.current) {
      showCustomAlert("Speech recognition not supported in your browser")
      return;
    }
    if(listening){
      recognitionRef.current.stop()
      setListening(false)
      return;
    }

    setListening(true)
    recognitionRef.current.start()
    recognitionRef.current.onresult = async (e) => {
      const transcript = e.results?.[0]?.[0].transcript?.trim()
      if (!transcript) {
        setListening(false)
        showCustomAlert("No speech detected. Please try again.")
        return
      }
      setInput(transcript)
      setListening(false);
      etSearchPopUp(false)
      await handleSearchData(transcript)
     }

    recognitionRef.current.onerror = (err) => {
  setListening(false)
  showCustomAlert(
    err.error === "no-speech"
      ? "No speech detected. Please try again."
      : "Voice search failed. Try again"
  )
}

    recognitionRef.current.onend = () => {
      setListening(false);
    }
  }


  const handleSearchData = async (query) => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/content/search" , {input:query} , {withCredentials:true})
      setSearchData(result.data);
      console.log(result.data);
      setInput("");
      setLoading(false);

      const {videos = [], shorts = [], playlists = [], channels = [] } = result.data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results");
      }else {
        speak("No results found")
      }
      
    } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("BACKEND ERROR:", error.response?.data);
}
  }

  const categories = [
    "Music", "Gaming", "Movies", "TV Shows", "News", "Trending", "Entertainment", "Education", "Science & Tech", "Travel",
    "Fashion", "Cooking", "Sports", "Pets", "Art", "Comedy", "Vlogs",
  ];

  const handleCategoryFilter = async (category) => {
    setLoading1(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/content/filter" , 
        { input : category },
        {withCredentials:true}
      )

      const {videos = [], shorts=[], channels = []} = result.data

      let channelVideos = [];
      let channelShorts = [];
      channels.forEach((ch) =>{
        if(ch.videos?.length) channelVideos.push(...ch.videos);
        if(ch.shorts?.length) channelShorts.push(...ch.shorts);
      })

      const uniqueVideos = [...new Map(
        [...videos, ...channelVideos].map((video) => [video?._id, video])
      ).values()];
      const uniqueShorts = [...new Map(
        [...shorts, ...channelShorts].map((short) => [short?._id, short])
      ).values()];

      setFilterData({
        ...result.data,
        videos: uniqueVideos,
        shorts: uniqueShorts
      })
      setLoading1(false)
      navigate("/")
      
      console.log("Category filter merged:", {
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts]
      });
      setLoading1(false)
      navigate("/")

      console.log("Category filter merged:", {
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      

      if(
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are some ${category} videos and shorts for you`)
      }else {
        speak("No results found")
      }
      
    } catch (error) {
      console.error("Category filter error", error)
      setLoading1(false);
      
    }
  }

  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

      {searchPopUp && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn'>
          <div className='bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-100 sm:min-h-100
          p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300'>
            <button className='absolute top-4 right-4 text-gray-400 hover:text-white transition' 
            onClick={()=>setSearchPopUp(false)}><FaTimes size={22}/>
            </button>

            <div className='flex flex-col items-center gap-3'>
              {listening ? (
                <h1 className='text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse'>
                  Listening....
                </h1>
              ) : (
                <h1 className='text-lg sm:text-xl font-medium text-gray-300'>
                  Speak or type your query
                </h1>
              )}

              {/* show recognized text */}
              {input && (
                <span className='text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60'>
                  {input}
                </span>
              )}

              <div className='flex w-full gap-2 md:hidden mt-4'>
                <input type="text" onChange={(e)=>setInput(e.target.value)} value={input} 
                className='flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border
                border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition' 
                placeholder='Type your search'/>
                <button className='bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white font-semibold
                shadow-md transition disabled:opacity-50' onClick={()=>handleSearchData(input)}>
                  {loading ? <ClipLoader size={20} color='white'/> : <FaSearch/>}</button>
              </div>
            </div>

            <button className='p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110
            bg-orange-500 hover:bg-orange-600 shadow-orange-500/40' onClick={handleSearch}>
              {loading ? <ClipLoader/> : <FaMicrophone size={24}/>}</button>
          </div>
        </div>
      )}

      {/* navbar */}
      <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50'>
        <div className='flex items-center justify-between'>

          {/* left */}
          <div className='flex items-center gap-4'>
            <button className='text-xl bg-[#272727] p-2 rounded-full md:inline hidden hover:bg-orange-400' onClick={()=>setSidebarOpen(!sidebarOpen)}
            ><FaBars className='cursor-pointer'/></button>
            <div className='flex items-center gap-1.25'>
              <img src={icon} alt="" className='w-7.5'/>
              <span className='text-white font-bold text-xl tracking-tight font-roboto'>Streamilix</span>
            </div>
          </div>

          {/* search */}
          {!isShortsPage && <div className='hidden md:flex items-center gap-2 flex-1 max-w-xl'>
            <div className='flex flex-1'>
              <input type="text" className='bg-[#121212] px-4 py-2 rounded-1-full outline-none border border-gray-700' 
              placeholder='Search' onChange={(e)=>setInput(e.target.value)} value={input}/>
              <button className='bg-[#272727] px-4 rounded-r-full border border-gray-700'
              onClick={()=>handleSearchData(input)}>{loading ? <ClipLoader size={20} color='white'/> : <FaSearch/>}</button>
              
              <button className='bg-[#272727] p-3 rounded-full ' onClick={()=>setSearchPopUp(!searchPopUp)}>
              <FaMicrophone />
            </button>
              
            </div>
            
          </div>}

          {/* right */}
          <div className='flex items-center gap-3'>
            {userData?.channel && <button className='hidden md:flex items-center gap-1 cursor-pointer'
            onClick={()=>navigate("/create")}>
              <span className='text-lg'>+</span>
              <span>Create</span>
            </button>}
            {!userData?.photoUrl ? <FaUserCircle className='text-3xl hidden md:flex text-gray-400'
            onClick={()=>setPopUp(prev=>!prev)}/>
            :<img src={userData?.photoUrl} className='w-9 h-9 rounded-full object-cover border
            border-gray-700 hidden md:flex' onClick={()=>setPopUp(prev=>!prev)}/>}
            {!isShortsPage && <FaSearch className='text-lg md:hidden flex' onClick={()=>setSearchPopUp(!searchPopUp)}/>}
          </div>
        </div>
      </header>


      {/* sidebar */}
      <aside className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-15 bottom-0 z-40
        ${sidebarOpen ? "w-60" : "w-20"} hidden md:flex flex-col overflow-y-auto`}>
        <nav className='space-y-1 mt-3'>
          <SidebarItem icon={<FaHome/>} text={"Home"} open={sidebarOpen} selected={selectedItem ==="Home"} 
          onClick={()=>{setSelectedItem("Home"); navigate("/")}}/>
          <SidebarItem icon={<SiYoutubeshorts/>} text={"Shorts"} open={sidebarOpen} selected={selectedItem ==="Shorts"} 
          onClick={()=>{setSelectedItem("Shorts"); navigate("/shorts")}}/>
          <SidebarItem icon={<MdOutlineSubscriptions/>} text={"Subscriptions"} open={sidebarOpen} selected={selectedItem ==="Subscriptions"} 
          onClick={()=>{setSelectedItem("Subscriptions");navigate("/subscription")}}/>
        </nav>

        <hr className='border-gray-800 my-3'/>

        {sidebarOpen && <p className='text-sm text-gray-400 px-2'>You</p>}
        <nav className='space-y-1 mt-3'>
          <SidebarItem icon={<FaHistory/>} text={"History"} open={sidebarOpen} selected={selectedItem ==="History"} 
          onClick={()=>{setSelectedItem("History");navigate("/history")}}/>
          <SidebarItem icon={<FaList/>} text={"Playlists"} open={sidebarOpen} selected={selectedItem ==="Playlists"} 
          onClick={()=>{setSelectedItem("Playlists");navigate("/savedplaylist")}}/>
          <SidebarItem icon={<GoVideo/>} text={"Saved Videos"} open={sidebarOpen} selected={selectedItem ==="Saved Videos"} 
          onClick={()=>{setSelectedItem("Saved Videos");navigate("/savedcontent")}}/>
          <SidebarItem icon={<FaThumbsUp/>} text={"Liked Videos"} open={sidebarOpen} selected={selectedItem ==="liked Videos"} 
          onClick={()=>{setSelectedItem("Liked Videos");navigate("/likedcontent")}}/>

        </nav>

        <hr className='border-gray-800 my-3'/>
        {sidebarOpen && <p className='text-sm text-gray-400 px-2'>Subscriptions</p>}

        <div className='space-y-1 mt-1'>
          {subscribedChannels?.map((channel)=>(
            <button key={channel?._id} onClick={()=>{setSelectedItem(channel?._id);navigate(`/channelpage/${channel?._id}`)}} 
            className={`flex items-center ${sidebarOpen ? "gap-3 justify-start" : "justify-center"} w-full text-left 
            cursor-pointer p-2 rounded-lg transition-5 ${selectedItem === channel?._id ? "bg-[#272727]" : "hover:bg-gray-800"}`}>
              <img src={channel?.avatar || icon} alt={`${channel?.name || "Channel"} logo`} className='w-8 h-8 object-cover rounded-full border border-gray-700 
              hover:scale-110 transition-transform duration-200 text-lg'/>
              {sidebarOpen && <span className='text-sm text-white truncate'>{channel?.name}</span>}
              </button>
          ))}
        </div>

      </aside>


      {/* Main Area */}
      <main className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all
        duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-20"}`}>
          {location.pathname === "/" && (
            <>
            <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth pt-2 mt-15'>
            {categories.map((cat,idx)=>(
              <button key={idx} className='whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm
              hover:bg-gray-700' onClick={()=>handleCategoryFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className='mt-3'>
            {loading1 && <div className='w-full items-center flex justify-center'>
            {loading1?<ClipLoader size={35} color='white'/>:""}</div>}
      
            {searchData && <SearchResults searchResults={searchData}/>}
            {filterData ? <FilterResults filterResults={filterData}/> : (
              userData ? <RecommendedContent/> : <><AllVideosPage/>
              <AllShortsPage/></>
            )}
            
          </div>
          </>)}
          {popUp && <Profile/>}

          {/* outlet */}
          <div className='mt-2'>
            <Outlet/>
          </div>
      </main>


      {/* bottom nav */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f]
      border-t border-gray-800 flex justify-around py-2 z-10'>
        <MobileSizeNav icon={<FaHome/>} text={"Home"} active={active === "Home"} 
        on onClick={()=>{setActive("Home");navigate("/home")}}/>
        <MobileSizeNav icon={<SiYoutubeshorts/>} text={"Shorts"} active={active === "Shorts"} 
        on onClick={()=>{setActive("Shorts");navigate("/shorts")}}/>
        <MobileSizeNav icon={<IoIosAddCircle size={40}/>} active={active === "+"} 
        on onClick={()=>{setActive("+");navigate("/create")}}/>
        <MobileSizeNav icon={<MdOutlineSubscriptions/>} text={"Subscriptions"} 
        active={active === "Subscriptions"} on onClick={()=>{setActive("Subscriptions");navigate("/subscription")}}/>
        <MobileSizeNav icon={!userData?.photoUrl?<FaUserCircle/>:<img src={userData?.photoUrl} 
        className='w-8 h-8 rounded-full object-cover border border-gray-700'/>} text={"You"} 
        active={active === "You"} on onClick={()=>{setActive("You");navigate("/mobileprofile")}}/>
      </nav>

    </div>

  )
}


function SidebarItem ({icon, text, open, selected, onClick}) {
  return(
    <button className={`flex items-center gap-4 p-2 rounded w-full transition-colors 
      ${open ? "justify-start" : "justify-center"} 
      ${selected ? "bg-[#272727]": "hover:bg-[#272727]"}`}
      onClick={onClick}>
      <span className='text-lg'>{icon}</span>
      {open && <span className='text-sm'>{text}</span>}
    </button>
  )

}

function MobileSizeNav ({icon, text, onClick, active}) {
  return (
    <button className={`flex flex-col items-center justify-center gap-1 
    px-3 py-2 rounded-lg transition-all duration-300 ${active ? "text-white" : "text-gray-400" } hover:scale-105`}
    onClick={onClick}>
      <span className='text-2xl'> {icon}</span>
      {text && <span className='text-xs'> {text}</span>}
    </button>
  )
}


export default Home;
import React, { useState } from 'react'
import CustomAlert from '../components/CustomAlert.jsx'
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



function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState("Home")
  const [active, setActive] = useState("Home")
  const navigate = useNavigate()
  const {userData} = useSelector((state)=>state.user)
  const [popUp, setPopUp] = useState(false)
  const location = useLocation()

  const categories = [
    "Music", "Gaming", "Movies", "TV Shows", "News", "Trending", "Entertainment", "Education", "Science & Tech", "Travel",
    "Fashion", "Cooking", "Sports", "Pets", "Art", "Comedy", "Vlogs",
  ];

  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

      {/* navbar */}
      <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50'>
        <div className='flex items-center justify-between'>

          {/* left */}
          <div className='flex items-center gap-4'>
            <button className='text-xl bg-[#272727] p-2 rounded-full md:inline hidden' onClick={()=>setSidebarOpen(!sidebarOpen)}
            ><FaBars/></button>
            <div className='flex items-center gap-1.25'>
              <img src={icon} alt="" className='w-7.5'/>
              <span className='text-white font-bold text-xl tracking-tight font-roboto'>Streamilix</span>
            </div>
          </div>

          {/* search */}
          <div className='hidden md:flex items-center gap-2 flex-1 max-w-xl'>
            <div className='flex flex-1'>
              <input type="text" className='bg-[#121212] px-4 py-2 rounded-1-full outline-none border border-gray-700' 
              placeholder='Search'/>
              <button className='bg-[#272727] px-4 rounded-r-full border border-gray-700' ><FaSearch/></button>
              
              <button className='bg-[#272727] p-3 rounded-full '>
              <FaMicrophone/>
            </button>
              
            </div>
            
          </div>

          {/* right */}
          <div className='flex items-center gap-3'>
            {userData?.channel && <button className='hidden md:flex items-center gap-1 cursor-pointer'>
              <span className='text-lg'>+</span>
              <span>Create</span>
            </button>}
            {!userData?.imageUrl ? <FaUserCircle className='text-3xl hidden md:flex text-gray-400'
            onClick={()=>setPopUp(prev=>!prev)}/>
            :<img src={userData?.imageUrl} className='w-9 h-9 rounded-full object-cover border
            border-gray-700 hidden md:flex' onClick={()=>setPopUp(prev=>!prev)}/>}
            <FaSearch className='text-lg md:hidden flex'/>
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
          onClick={()=>setSelectedItem("Subscriptions")}/>
        </nav>

        <hr className='border-gray-800 my-3'/>

        {sidebarOpen && <p className='text-sm text-gray-400 px-2'>You</p>}
        <nav className='space-y-1 mt-3'>
          <SidebarItem icon={<FaHistory/>} text={"History"} open={sidebarOpen} selected={selectedItem ==="History"} 
          onClick={()=>setSelectedItem("History")}/>
          <SidebarItem icon={<FaList/>} text={"Playlists"} open={sidebarOpen} selected={selectedItem ==="Playlists"} 
          onClick={()=>setSelectedItem("Playlists")}/>
          <SidebarItem icon={<GoVideo/>} text={"Saved Videos"} open={sidebarOpen} selected={selectedItem ==="Saved Videos"} 
          onClick={()=>setSelectedItem("Saved Videos")}/>
          <SidebarItem icon={<FaThumbsUp/>} text={"Liked Videos"} open={sidebarOpen} selected={selectedItem ==="liked Videos"} 
          onClick={()=>setSelectedItem("Liked Videos")}/>

        </nav>

        <hr className='border-gray-800 my-3'/>
        {sidebarOpen && <p className='text-sm text-gray-400 px-2'>Subcriptions</p>}

      </aside>


      {/* Main Area */}
      <main className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all
        duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-20"}`}>
          {location.pathname === "/" && (
            <>
            <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth pt-2 mt-15'>
            {categories.map((cat,idx)=>(
              <button key={idx} className='whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm
              hover:bg-gray-700'>
                {cat}
              </button>
            ))}
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
        on onClick={()=>setActive("Home")}/>
        <MobileSizeNav icon={<SiYoutubeshorts/>} text={"Shorts"} active={active === "Shorts"} 
        on onClick={()=>setActive("Shorts")}/>
        <MobileSizeNav icon={<IoIosAddCircle size={40}/>} active={active === "+"} 
        on onClick={()=>setActive("+")}/>
        <MobileSizeNav icon={<MdOutlineSubscriptions/>} text={"Subscriptions"} 
        active={active === "Subscriptions"} on onClick={()=>setActive("Subscriptions")}/>
        <MobileSizeNav icon={!userData?.imageUrl?<FaUserCircle/>:<img src={userData?.imageUrl} 
        className='w-8 h-8 rounded-full object-cover border border-gray-700'/>} text={"You"} 
        active={active === "You"} on onClick={()=>setActive("You")}/>
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
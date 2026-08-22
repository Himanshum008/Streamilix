import React from 'react'
import CustomAlert from '../components/CustomAlert.jsx'
import { FaBars } from 'react-icons/fa'
import icon from "../assets/icon.png"

function Home() {
  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

      {/* navbar */}
      <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50'>
        <div className='flex items-center justify-between'>

          {/* left */}
          <div className='flex items-center gap-4'>
            <button className='text-xl bg-[#272727] p-2 rounded-full md:inline hidden'
            ><FaBars/></button>
            <div className='flex items-center gap-1.25'>
              <img src={icon} alt="" className='w-7.5'/>
              <span className='text-white font-bold text-xl tracking-tight font-roboto'>Streamilix</span>
            </div>
          </div>
        </div>
      </header>
    </div>

  )
}

export default Home
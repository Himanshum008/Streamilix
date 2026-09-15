import React from 'react'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { useSelector } from "react-redux"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"


const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 10000) return 0;
    return Math.floor(views / 1000) * 50;
  }


 if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor(views / 1000) * 50;
  }
  return 0;
}
const Revenue = () => {
  const {channelData} = useSelector((state)=>state.user)

  if (!channelData) {
    return (
      <div className='flex items-center justify-center h-screen text-gray-400'>
        Loading channel data....</div>
    )
  }


  {/* video revenue data */}

  const videoRevenueData = (channelData.videos || []).map((video)=>({
    title: video.title.length > 10 ? video.title.slice(0, 10) + "..." : video.title,
    revenue: calculateRevenue(video.views || 0, "video"),
  }));

  {/* Short revenue data */}

  const shortRevenueData = (channelData.shorts || []).map((short)=>({
    title: short.title.length > 10 ? short.title.slice(0, 10) + "..." : short.title,
    revenue: calculateRevenue(short.views || 0, "short"),
  }));

  { /* Total Revenue */}
  const totalRevenue = 
  videoRevenueData.reduce((sum, v) => sum + v.revenue, 0) +
  shortRevenueData.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <div className='w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-12.5'>

    {/* Revenue Rules */}
    <div className='bg-linear-to-r from-orange-700 to-orange-500 rounded-lg p-2 shadow-md'>
        <div>🎥 Videos → ₹50 per 1,000 views (after first 1,000)</div>
        <div>🎬 Shorts → ₹50 per 10,000 views (after first 10,000)</div>
      <h2 className='text-lg font-semibold mb-2 text-gray-900'>💡 Revenue Rules</h2>

      <ul className='text-sm space-y-1 text-gray-800'>
      </ul>
    </div>

    {/* Videos Revenue Chart */}
    <div className='bg-[#0b0b0b] border border-gray-700 rounded-lg p-4'>
      <h2 className='text-lg font-semibold mb-3'>Videos Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={videoRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" tick={{fontSize: 10}}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue"  stroke="#3b82fc" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Shorts Revenue Chart */}
    <div className='bg-[#0b0b0b] border border-gray-700 rounded-lg p-4'>
      <h2 className='text-lg font-semibold mb-3'>Shorts Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={shortRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" tick={{fontSize: 10}}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue"  stroke="#10b981" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Total Revenue Card */}
    <div className='bg-[#0b0b0b] border border-gray-700 rounded-lg p-4 text-center'>
      <h2 className='text-lg font-semibold mb-2'>Total Estimated Revenue</h2>
      <p className='text-lg font-semibold mb-2'>₹{totalRevenue}</p>
    </div>
  </div>
  )
}

export default Revenue
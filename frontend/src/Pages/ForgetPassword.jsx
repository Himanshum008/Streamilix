import React, { useState } from 'react'
import icon from "../assets/icon.png"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { showCustomAlert } from '../components/CustomAlert.jsx'
import { ClipLoader } from 'react-spinners'

function ForgetPassword() {
  const [step, setStep] = useState(1)
  const [email,setEmail] = useState("")
  const [otp,setOtp] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/sendotp" , {email} , {withCredentials:true})
      console.log(result.data);
      setStep(2)
      setLoading(false)
      showCustomAlert(result.data.message)
    } catch (error) {
      console.log(error);
      setLoading(false)
      showCustomAlert(`send otp error ${error}`)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/verifyotp" , {email, otp} , {withCredentials:true})
      setLoading(true)
      setStep(3)
      setLoading(false)
      showCustomAlert(result.data.message)
    } catch (error) {
      console.log(error);
      setLoading(false)
      showCustomAlert(`verify otp error ${error}`)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      if (newPassword !== confirmPassword) {
        setLoading(false)
        showCustomAlert("Password is not match")
      }
      const result = await axios.post(serverUrl + "/api/auth/resetpassword" , {email, password:newPassword} , {withCredentials:true})
      setLoading(true)
      navigate("/signin")
      setLoading(false)
      showCustomAlert(result.data.message)
    } catch (error) {
      console.log(error);
      setLoading(false)
      showCustomAlert(`Reset password error ${error}`)
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-[#202124] text-white'>
      
      <header className='flex items-center gap-2 p-4 border-b border-gray-700'>
        <img src={icon} alt="logo" className='w-8 h-8'/>
        <span className='text-white font-bold text-xl tracking-tight font-roboto'>Streamilix</span>
      </header>

      <main className='flex flex-1 items-center justify-center px-4'>
        {step === 1 && (<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
          <h2 className='text-2xl foont-semibold mb-6'>Forget your Password</h2>
          <form action="" className='space-y-4' onSubmit={(e)=>e.preventDefault()}>
            <div>

              <label htmlFor="email" className='block text-sm mb-1'>Enter your email address :</label>
              <input type="text" id='email' className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent
              text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required 
              onChange={(e)=>setEmail(e.target.value)} value={email}/>
            </div>
            <button className='w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium'
            disabled={loading} onClick={handleSendOtp}>{loading? <ClipLoader color='black' size={20}/>:"Send OTP"}</button>
          </form>
          <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate("/signin")}>
              Back to Sign In</div>
          </div>)}


          {step === 2 && (<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
          <h2 className='text-2xl foont-semibold mb-6'>Reset your password</h2>
          <form action="" className='space-y-4' onSubmit={(e)=>e.preventDefault()}>
            <div>

              <label htmlFor="otp" className='block text-sm mb-1'>Please enter the 4-digit code sent to your email</label>
              <input type="text" id='otp' className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent
              text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required 
              onChange={(e)=>setOtp(e.target.value)} value={otp}/>
            </div>
            <button className='w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium'
            onClick={handleVerifyOtp}>{loading ? <ClipLoader color='black' size={20}/>: "Verify OTP"}</button>
          </form>
          <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate("/signin")}>
              Back to Sign In</div>
          </div>)}

          {step === 3 && (<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
          <h2 className='text-2xl font-semibold mb-6'>Reset your Password</h2>
          <p className='text-sm text-gray-400 mb-6'>Enter a new password below to regain access to yoour account</p>
          <form action="" className='space-y-4' onSubmit={(e)=>e.preventDefault()}>
            <div>
              <label htmlFor="newpass" className='block text-sm mb-1'>New Password :</label>
              <div className='relative'>
                <input type={showNewPassword ? "text" : "password"} id='newpass' className='mt-1 w-full px-4 py-3 pr-12 border border-gray-600 rounded-md bg-transparent
                text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required 
                onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
                <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white'
                onClick={()=>setShowNewPassword((previous)=>!previous)}>
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label htmlFor="conpass" className='block text-sm mb-1 mt-5'>Confirm Password :</label>
              <div className='relative'>
                <input type={showConfirmPassword ? "text" : "password"} id='conpass' aria-label='confirm password' className='mt-1 w-full px-4 py-3 pr-12 border border-gray-600 rounded-md bg-transparent
                text-white focus:outline-none focus:ring-2 focus:ring-orange-500 mb-5' required 
                onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}/>
                <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white'
                onClick={()=>setShowConfirmPassword((previous)=>!previous)}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button className='w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium'
            disabled={loading} onClick={handleResetPassword}>{loading ? <ClipLoader color='black' size={20}/>:"Reset Password"}</button>
          </form>
          <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate("/signin")}>
              Back to Sign In</div>
          </div>)}
      </main>
    </div>
  )
}

export default ForgetPassword
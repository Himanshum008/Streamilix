import React, { useEffect, useState } from 'react'

let alertHandle;

export const showCustomAlert = (message) => {
  if(alertHandle){
    alertHandle(message)
  }
}

function CustomAlert() {
  const [message, setMessage] = useState("")
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    alertHandle = (msg) =>{
      setMessage(msg)
      setVisible(true)
    }
  },[])

  return (
  visible && <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50">
    <div className="bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80 mt-6">
      <p className="text-sm">{message}</p>
      <div className="flex justify-end mt-6">
        <button className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full'
        onClick={()=>setVisible(false)}>Ok</button>
          </div>
        </div>
    </div>
  )
}

export default CustomAlert;

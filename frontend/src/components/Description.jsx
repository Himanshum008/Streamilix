import React, { useState } from 'react'

function Description({text=""}) {
    const [expanded, setExpanded] = useState(false)

    const showButton = text?.length >100;

  return (
    <div>
        <p className={`text-sm text-gray-300 whitespace-pre-line ${expanded ? "" : "line-clamp-1"}`}>{text}</p>
        {showButton && <button className='text-xs text-blue-400 mt-1 hover:underline' onClick={()=>setExpanded(!expanded)}>
            {expanded ? "show less" : "show more"}
            </button>}
    </div>
  )
}

export default Description
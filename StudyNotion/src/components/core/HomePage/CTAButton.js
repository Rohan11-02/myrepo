import React from 'react'
import { Link } from 'react-router-dom'

export const CTAButton = ({children, linkto, active}) => {
  return (<div>
    <Link to={linkto}>
        <div className={`rounded-lg py-[12px] px-[24px] ${active ? "bg-yellow-50 text-black" : "bg-richblack-800 text-white"} 
        hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>
  </div>)
}

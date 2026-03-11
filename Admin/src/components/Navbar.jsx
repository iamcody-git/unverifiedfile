import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../../Frontend/src/assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="w-20 h-20 object-contain"
            src={assets.logoglam}
            alt="Admin Home"
          />
        </Link>
        <button
          onClick={() => setToken('')}
          className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full"
        >
          Logout
        </button>
      
    </div>
  )
}

export default Navbar

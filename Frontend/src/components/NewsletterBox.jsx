import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler = (event)=>{
        event.preventDefault();

    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam dolores ducimus corporis?
        </p>
        <form onSubmit={onSubmitHandler} action="" className="w-full sm:w-1/2 flex items-center gap-4 mx-auto my-6 border pl-3 py-2 rounded-lg shadow-lg">
    <input 
        className="w-full sm:flex-1 outline-none border border-gray-300 p-3 rounded-lg focus:border-black" 
        type="email" 
        placeholder="Enter your email" 
        required
    />
    <button 
        className="bg-black m-2 text-white text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300" 
        type="submit"
    >
        SUBSCRIBE
    </button>
</form>

      
    </div>
  )
}

export default NewsletterBox

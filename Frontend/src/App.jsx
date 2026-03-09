
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import './index.css'
import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Product from './pages/Product'
import PlaceOrder from './pages/PlaceOrder'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Footer from './components/Footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>} />
        <Route path='/collection' element={< Collection/>} />
        <Route path='/Login' element={< Login/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='place-orders' element={<PlaceOrder/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/cart' element={<Cart/>} />
      </Routes>
      <Footer />
      

    </div>
  )
}

export default App

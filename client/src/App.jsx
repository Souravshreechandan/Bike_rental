import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import BikeDetails from './pages/BikeDetails'
import Bikes from './pages/Bikes'
import MyBookings from './pages/MyBookings'



const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  const isOwnerPath=useLocation().pathname.startsWith('/owner')
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bike-details/:id' element={<BikeDetails/>} />
        <Route path='/bikes' element={<Bikes/>} />
        <Route path='/my_bookings' element={<MyBookings/>} />
      </Routes>
    </>
  )
}

export default App

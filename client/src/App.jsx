import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import BikeDetails from './pages/BikeDetails'
import Bikes from './pages/Bikes'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddBike from './pages/owner/AddBike'
import ManageBikes from './pages/owner/ManageBikes'
import ManageBooking from './pages/owner/ManageBooking'



const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  const isOwnerPath=useLocation().pathname.startsWith('/owner')
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bike_details/:id' element={<BikeDetails/>} />
        <Route path='/bikes' element={<Bikes/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/owner' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-bike' element={<AddBike/>}/>
          <Route path='manage-bikes' element={<ManageBikes/>}/>
          <Route path='manage-bookings' element={<ManageBooking/>}/>
        </Route>

      </Routes>
      

      {!isOwnerPath && <Footer/>}
    </>
  )
}

export default App

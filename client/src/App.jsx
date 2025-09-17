import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BikeDetails from './pages/BikeDetails';
import Bikes from './pages/Bikes';
import MyBookings from './pages/MyBookings';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddBike from './pages/owner/AddBike';
import ManageBikes from './pages/owner/ManageBikes';
import ManageBooking from './pages/owner/ManageBooking';
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'

const App = () => {
  const[showLogin,setShowLogin]=useState(false)
  const location = useLocation();
  const isOwnerPath = useLocation().pathname.startsWith('/owner');

  return (
    <>
    <Toaster/>
      {showLogin && <Login setShowLogin={setShowLogin}/>}
   
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bike_details/:id" element={<BikeDetails />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-bike" element={<AddBike />} />
          <Route path="manage-bikes" element={<ManageBikes />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;

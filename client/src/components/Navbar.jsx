import React, { useState, useEffect } from 'react';
import { data, Link, useLocation, useNavigate } from 'react-router-dom';
import { assets, menuLinks } from '../assets/assets';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {

  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  // Stable live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show only first name 
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  // Fixed width time format
  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedDay = time.toLocaleDateString('en-IN', {
    weekday: 'short',
  });

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && 'bg-light'}`}
    >

      {/* LEFT: Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={assets.logo}
            alt="logo"
            className="h-12 sm:h-14"
          />
        </Link>
      </div>

      {/* Menu */}
      <div
        className={`flex-1 max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:left-0 max-sm:border-t border-borderColor flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? 'bg-light' : 'bg-white'} ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} className="whitespace-nowrap">
            {link.name}
          </Link>
        ))}

        {/* Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 py-1.5 rounded-full max-w-48">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
            placeholder="Search Bike"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-3 sm:gap-6 ml-2 sm:ml-4">

        {/* Dashboard */}
        <button
          onClick={() => isOwner ? navigate('/owner') : navigate('/')}
          className="cursor-pointer whitespace-nowrap text-sm sm:text-base"
        >
          {isOwner && 'Dashboard'}
        </button>

        {/* Welcome First Name Only */}
        {user && (
          <p className="text-gray-700 whitespace-nowrap font-medium text-sm sm:text-base">
            Welcome, {firstName}
          </p>
        )}

        {/* Time + Day + Date */}
        <div className="w-[95px] sm:w-[120px] text-center leading-tight">
          <div className="font-mono text-sm sm:text-lg font-semibold text-gray-800">
            {formattedTime}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
            {formattedDay}, {formattedDate}
          </div>
        </div>

        {/* Login / Logout */}
        <button
          onClick={() => { user ? logout() : setShowLogin(true) }}
          className="flex items-center gap-2 px-3 sm:px-6 py-2 rounded-lg border border-blue-600
          text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white
          transition-all duration-300 whitespace-nowrap text-sm sm:text-base"
        >
          {!user && (
            <img src={assets.user_icon} alt="user" className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          {user ? 'Logout' : 'Login'}
        </button>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden cursor-pointer ml-1"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>

      </div>
    </motion.div>
  );
};

export default Navbar;
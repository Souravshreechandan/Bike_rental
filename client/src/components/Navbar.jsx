import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { assets, menuLinks } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {

  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const { setShowLogin, user, logout } = useAppContext();

  // Live Clock
  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const isHome = location.pathname === '/';

  const textColor = isHome
    ? 'text-white'
    : 'text-black';

  const subText = isHome
    ? 'text-gray-300'
    : 'text-gray-500';

  // Time
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
    weekday: 'short',
  });

  return (

    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full z-50 transition-all duration-300
      ${
        isHome
          ? 'absolute top-0 left-0 bg-transparent'
          : 'sticky top-0 bg-white shadow-md'
      }`}
    >

      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center overflow-visible">

          <img
            src={assets.logo}
            alt="logo"
            className="h-10 w-auto scale-[4.5] origin-left object-contain"
          />

        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">

          {menuLinks.map((link, index) => (

            <Link
              key={index}
              to={link.path}
              className={`relative text-sm font-medium transition-all duration-300
              ${
                isHome
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-black'
              }`}
            >

              {link.name}

              {location.pathname === link.path && (

                <span
                  className={`absolute left-0 -bottom-2 w-full h-[2px] rounded-full
                  ${isHome ? 'bg-white' : 'bg-black'}`}
                ></span>

              )}

            </Link>

          ))}

        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-5">

          {/* Time */}
          <div className={`w-[120px] text-center leading-tight ${textColor}`}>

            <div className="font-mono text-lg font-semibold">
              {formattedTime}
            </div>

            <div className={`text-xs font-medium ${subText}`}>
              {formattedDate}
            </div>

          </div>

          {/* Login */}
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className={`flex items-center gap-2 border px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
            ${
              isHome
                ? 'border-white/40 text-white hover:bg-white hover:text-black'
                : 'border-black/20 text-black hover:bg-black hover:text-white'
            }`}
          >

            <img
              src={assets.user_icon}
              alt="user"
              className={`w-4 h-4 ${isHome ? 'invert' : ''}`}
            />

            {user ? 'Logout' : 'Login'}

          </button>

        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden ${textColor}`}
        >

          {open ? <X size={28} /> : <Menu size={28} />}

        </button>

      </div>

      {/* Mobile Menu */}
      {open && (

        <div
          className={`md:hidden mx-5 mt-2 rounded-2xl backdrop-blur-lg p-6 flex flex-col gap-5
          ${
            isHome
              ? 'bg-black/90'
              : 'bg-white shadow-lg'
          }`}
        >

          {/* Mobile Time */}
          <div className={`text-center leading-tight ${textColor}`}>

            <div className="font-mono text-lg font-semibold">
              {formattedTime}
            </div>

            <div className={`text-xs font-medium ${subText}`}>
              {formattedDate}
            </div>

          </div>

          {/* Mobile Links */}
          {menuLinks.map((link, index) => (

            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`text-base transition
              ${
                isHome
                  ? 'text-white hover:text-gray-300'
                  : 'text-black hover:text-gray-500'
              }`}
            >

              {link.name}

            </Link>

          ))}

          {/* Mobile Login */}
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className={`flex items-center justify-center gap-2 border px-5 py-3 rounded-xl transition-all
            ${
              isHome
                ? 'border-white/40 text-white hover:bg-white hover:text-black'
                : 'border-black/20 text-black hover:bg-black hover:text-white'
            }`}
          >

            <img
              src={assets.user_icon}
              alt="user"
              className={`w-4 h-4 ${isHome ? 'invert' : ''}`}
            />

            {user ? 'Logout' : 'Login'}

          </button>

        </div>

      )}

    </motion.nav>
  );
};

export default Navbar;
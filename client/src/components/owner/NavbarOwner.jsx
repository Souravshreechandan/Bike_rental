import React, { useEffect, useState } from 'react';
import { ownerMenuLinks } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

  const { user, logout, setShowLogin } = useAppContext();

  const location = useLocation();
  const [time, setTime] = useState(new Date());

  // Live stable clock
  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // Show only first name
  const firstName = user?.name
    ? user.name.split(' ')[0]
    : 'Owner';

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

  return (

    <div
      className='flex items-center
      px-4 sm:px-6 md:px-10
      py-4 sm:py-6
      text-gray-500
      border-b border-borderColor
      relative transition-all'
    >

      {/* Left Welcome Section */}
      <div className="flex items-center min-w-fit">

        <p
          className="text-gray-700 font-medium
          whitespace-nowrap text-sm sm:text-base"
        >
          Welcome, {firstName}
        </p>

      </div>

      {/* Menu Links */}
      <ul
        className='flex-1 flex justify-center items-center
        gap-4 sm:gap-6 text-sm sm:text-base'
      >

        {ownerMenuLinks.map((link) => (

          <li key={link.name}>

            <Link
              to={link.path}
              className={`whitespace-nowrap
              hover:text-blue-500 transition-colors
              ${
                location.pathname === link.path
                  ? 'font-semibold text-blue-500'
                  : ''
              }`}
            >

              {link.name}

            </Link>

          </li>

        ))}

      </ul>

      {/* Right Section */}
      <div className="flex-shrink-0 flex items-center gap-3 sm:gap-6">

        {/* Stable Time + Day + Date */}
        <div className="w-[95px] sm:w-[120px] text-center leading-tight">

          <div
            className="font-mono text-sm sm:text-lg
            font-semibold text-gray-800"
          >
            {formattedTime}
          </div>

          <div
            className="text-[10px] sm:text-xs
            text-gray-500 font-medium"
          >
            {formattedDay}, {formattedDate}
          </div>

        </div>

        {/* Login / Logout Button */}
        <button
          onClick={() => {
            user ? logout() : setShowLogin(true);
          }}
          className={`px-4 py-2 rounded-lg border
          transition-all duration-300
          text-sm sm:text-base
          ${
            user
              ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
              : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
          }`}
        >

          {user ? 'Logout' : 'Login'}

        </button>

      </div>

    </div>
  );
};

export default NavbarOwner;
import React, { useEffect, useState } from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  // Live stable clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show only first name (before space)
  const firstName = user?.name ? user.name.split(' ')[0] : 'Owner';

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
      className='flex items-center px-4 sm:px-6 md:px-10 py-4 sm:py-6
      text-gray-500 border-b border-borderColor relative transition-all'
    >
      {/* LEFT: Logo */}
      <div className="flex-shrink-0">
        <Link to='/'>
          <img src={assets.logo} alt="App Logo" className='h-7 sm:h-8' />
        </Link>
      </div>

      {/* Menu Links*/}
      <ul className='flex-1 flex justify-center items-center gap-4 sm:gap-6 text-sm sm:text-base'>
        {ownerMenuLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={`whitespace-nowrap hover:text-blue-500 transition-colors ${
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

      {/* Welcome + Stable Time & Date */}
      <div className="flex-shrink-0 flex items-center gap-3 sm:gap-6">
        
        {/* Welcome First Name Only */}
        <p className="text-gray-700 font-medium whitespace-nowrap text-sm sm:text-base">
          Welcome, {firstName}
        </p>

        {/* Stable Time + Day + Date */}
        <div className="w-[95px] sm:w-[120px] text-center leading-tight">
          <div className="font-mono text-sm sm:text-lg font-semibold text-gray-800">
            {formattedTime}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
            {formattedDay}, {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarOwner;
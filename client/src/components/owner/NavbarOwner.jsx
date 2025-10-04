import React from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const location = useLocation();

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-6
      text-gray-500 border-b border-borderColor relative transition-all'>

      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt="App Logo" className='h-7' />
      </Link>

      {/* Menu Links */}
      <ul className='flex space-x-6'>
        {ownerMenuLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={`hover:text-blue-500 transition-colors ${
                location.pathname === link.path ? 'font-semibold text-blue-500' : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Welcome Message */}
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;

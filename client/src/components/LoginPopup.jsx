import React from 'react';
import { assets } from '../../assets/assets';

const LoginPopup = ({ showLogin, setShowLogin }) => {
  // If showLogin is false, the component will not render.
  if (!showLogin) {
    return null;
  }

  return (
    // The z-[9999] ensures this popup is on top of all other elements, including the Navbar.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4 font-sans transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative transform scale-95 opacity-0 animate-scaleIn transition-transform transition-opacity">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Close Login Popup"
        >
          <img src={assets.cross_icon} alt="Close" className="w-5 h-5" />
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary-dark">Log In</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-light transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-light transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dull transition-colors font-medium text-lg shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <style>
        {`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}
      </style>
    </div>
  );
};

export default LoginPopup;

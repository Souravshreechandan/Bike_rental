import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Footer = () => {

  return (

    <motion.footer

      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}

      transition={{
        duration: 0.7
      }}

      className='bg-[#020b22]
      text-white
      px-6 md:px-16 lg:px-24
      pt-8 pb-6 overflow-hidden'
    >

      {/* Top Section */}
      <div
        className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-4
        gap-12 pb-10 border-b border-white/10'
      >

        {/* Logo Section */}
        <div>

          <img
            src={assets.logo}
            alt="logo"
            className='h-28 w-auto object-contain -my-6'
          />

          <p
            className='text-white/70
            mt-5 leading-8 max-w-sm'
          >
            Premium bike rental service with a wide
            selection of luxury and everyday vehicles
            for all your driving needs.
          </p>

          {/* Social Icons */}
          <div className='flex items-center gap-4 mt-7'>

            <a
              href="#"
              className='w-11 h-11 rounded-full
              bg-white/10 hover:bg-blue-600
              transition-all duration-300
              flex items-center justify-center'
            >

              <img
                src={assets.facebook_logo}
                alt=""
                className='w-5 h-5 brightness-0 invert'
              />

            </a>

            <a
              href="#"
              className='w-11 h-11 rounded-full
              bg-white/10 hover:bg-pink-600
              transition-all duration-300
              flex items-center justify-center'
            >

              <img
                src={assets.instagram_logo}
                alt=""
                className='w-5 h-5 brightness-0 invert'
              />

            </a>

            <a
              href="#"
              className='w-11 h-11 rounded-full
              bg-white/10 hover:bg-sky-500
              transition-all duration-300
              flex items-center justify-center'
            >

              <img
                src={assets.twitter_logo}
                alt=""
                className='w-5 h-5 brightness-0 invert'
              />

            </a>

            <a
              href="#"
              className='w-11 h-11 rounded-full
              bg-white/10 hover:bg-red-500
              transition-all duration-300
              flex items-center justify-center'
            >

              <img
                src={assets.gmail_logo}
                alt=""
                className='w-5 h-5 brightness-0 invert'
              />

            </a>

          </div>

        </div>

        {/* Quick Links */}
        <div>

          <h2
            className='text-white font-semibold
            text-lg uppercase mb-5'
          >
            Quick Links
          </h2>

          <ul className='space-y-4 text-white/70'>

            <li>
              <a href="#" className='hover:text-white transition'>
                Home
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                Browse Bikes
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                List Your Bikes
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                About Us
              </a>
            </li>

          </ul>

        </div>

        {/* Resources */}
        <div>

          <h2
            className='text-white font-semibold
            text-lg uppercase mb-5'
          >
            Resources
          </h2>

          <ul className='space-y-4 text-white/70'>

            <li>
              <a href="#" className='hover:text-white transition'>
                Help Center
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                Terms of Service
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#" className='hover:text-white transition'>
                Insurance
              </a>
            </li>

          </ul>

        </div>

        {/* Contact */}
        <div>

          <h2
            className='text-white font-semibold
            text-lg uppercase mb-5'
          >
            Contact
          </h2>

          <ul className='space-y-4 text-white/70'>

            <li className='flex items-start gap-3'>
              📍 1234-Luxury Drive
              <br />
              Bangalore
            </li>

            <li className='flex items-center gap-3'>
              📞 +91 9876543210
            </li>

            <li className='flex items-center gap-3'>
              ✉ info@bikerental.com
            </li>

          </ul>

        </div>

      </div>

      {/* Bottom */}
      <div
        className='flex flex-col md:flex-row
        items-center justify-between
        gap-4 pt-6 text-white/60 text-sm'
      >

        <p>
          © {new Date().getFullYear()} BikeRental.
          All rights reserved.
        </p>

        <ul className='flex items-center gap-4'>

          <li>
            <a href="#" className='hover:text-white transition'>
              Privacy
            </a>
          </li>

          <li>|</li>

          <li>
            <a href="#" className='hover:text-white transition'>
              Terms
            </a>
          </li>

          <li>|</li>

          <li>
            <a href="#" className='hover:text-white transition'>
              Cookies
            </a>
          </li>

        </ul>

      </div>

    </motion.footer>
  )
}

export default Footer
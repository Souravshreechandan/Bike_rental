import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Banner = () => {

  return (

    <motion.div

      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}

      transition={{
        duration: 0.7
      }}

      className='bg-[#f5f7fb] px-6 md:px-16 lg:px-24 py-3'
    >

      {/* Main Banner */}
      <div
        className='relative overflow-hidden
        rounded-[30px]
        bg-gradient-to-r from-[#0033cc] via-[#0047ff] to-[#6a00ff]
        px-8 md:px-14 py-10'
      >

        {/* Blur */}
        <div
          className='absolute top-0 right-0
          w-80 h-80 bg-white/10
          rounded-full blur-3xl'
        ></div>

        <div className='relative z-10 grid lg:grid-cols-2 gap-10 items-center'>

          {/* LEFT SIDE */}
          <div className='text-white'>

            <motion.h2

              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}

              transition={{
                delay: 0.2,
                duration: 0.5
              }}

              className='text-4xl md:text-5xl
              font-bold leading-tight'
            >

              Own a Bike?
              <br />
              Earn Money from It

            </motion.h2>

            <motion.p

              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}

              transition={{
                delay: 0.3,
                duration: 0.5
              }}

              className='mt-5 text-white/80
              text-lg max-w-md leading-8'
            >

              List your bike on BikeRental and earn
              passive income with zero hassle.

            </motion.p>

            {/* Button */}
            <motion.button

              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}

              className='mt-8 bg-white hover:bg-slate-100
              text-blue-700 font-semibold
              px-8 py-4 rounded-2xl
              flex items-center gap-3
              transition-all duration-300 cursor-pointer'
            >

              List your bike

              <img
                src={assets.arrow_icon}
                alt="arrow"
                className='w-4'
              />

            </motion.button>

          </div>

          {/* RIGHT SIDE */}
          <div className='relative flex justify-center'>

            {/* Bike */}
            <motion.img

              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}

              transition={{
                delay: 0.5,
                duration: 0.7
              }}

              src={assets.banner_bike_image}
              alt="bike"

              className='w-full max-w-lg
              drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
            />

            {/* Earn Card */}
            <div
              className='absolute bottom-8 right-0
              bg-white rounded-2xl
              px-6 py-4 shadow-xl'
            >

              <p className='text-sm text-gray-500'>
                Earn More
              </p>

              <h3 className='text-3xl font-bold text-gray-900 mt-1'>
                ₹25,000
              </h3>

              <p className='text-sm text-gray-500'>
                /month
              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  )
}

export default Banner
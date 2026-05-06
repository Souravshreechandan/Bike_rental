import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'

const Hero = () => {

  const [pickupLocation, setPickupLocation] = useState('')

  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate
  } = useAppContext()

  const handleSearch = (e) => {
    e.preventDefault()

    navigate(
      '/bikes?pickupLocation=' +
      pickupLocation +
      '&pickupDate=' +
      pickupDate +
      '&returnDate=' +
      returnDate
    )
  }

  return (

    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <img
        src={assets.hero_bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-24">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-5xl md:text-7xl font-bold leading-tight"
            >
              Find Your
              <br />
              Perfect <span className="text-blue-500">Ride</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/80 mt-6 text-lg"
            >
              Explore premium bikes near you
              and make every journey memorable.
            </motion.p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mt-10 text-white">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  ✓
                </div>
                Easy Booking
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  ✓
                </div>
                Best Prices
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  ✓
                </div>
                24/7 Support
              </div>

            </div>

          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >

            <img
              src={assets.main_bike}
              alt=""
              className="w-full max-w-3xl"
            />

          </motion.div>

        </div>

        {/* Search Box */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] p-5 md:p-7 shadow-2xl mt-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            {/* Location */}
            <div>

              <label className="text-sm font-semibold">
                Pickup Location
              </label>

              <select
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full mt-3 border rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Select your location</option>

                {cityList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}

              </select>

            </div>

            {/* Pickup Date */}
            <div>

              <label className="text-sm font-semibold">
                Pick-up Date
              </label>

              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full mt-3 border rounded-xl px-4 py-4 outline-none"
              />

            </div>

            {/* Return Date */}
            <div>

              <label className="text-sm font-semibold">
                Return Date
              </label>

              <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                required
                className="w-full mt-3 border rounded-xl px-4 py-4 outline-none"
              />

            </div>

            {/* Button */}
            <div className="flex items-end">

              <button
                className="w-full bg-blue-600 hover:bg-blue-700
                text-white py-4 rounded-xl flex items-center
                justify-center gap-2 font-medium"
              >

                <img
                  src={assets.search_icon}
                  alt=""
                  className="brightness-0 invert"
                />

                Search Bikes

              </button>

            </div>

          </div>

        </motion.form>

      </div>

    </div>
  )
}

export default Hero
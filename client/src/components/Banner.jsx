import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-start items-center justify-between
    px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#a9cFFF] max-w-6xl mx-3
    md:mx-auto rounded-2xl overflow-hidden'>
      
      <div className='text-white'>
        <h2 className='text-3xl font-medium'>Do You Own Have Bike?</h2>
        <p className='mt-2'>Monetize your vehicle effortlessly by listing it on BikeRental.</p>
        <p className='max-w-130'>We take care of insurance,driver verification and 
        secure payment - so you earn passive income, stress-free.</p>

        <button className='px-6 py-2 bg-white hover:bg-slate-100 transition-all
        text-primary rounded-lg text-sm mt-4 cursor-pointer'>List your bike</button>
      </div>
      <img src={assets.banner_bike_image} alt="bike" className='max-h-60 mt-1'/>
    </div>
  )
}

export default Banner

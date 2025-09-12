import React from 'react'
import Title from './Title'
import { assets, dummyBikeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import BikeCard from './BikeCard'

const FeaturedSection = () => {
    const navigate =useNavigate()
  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:gap-x-32'>
      <div>
        <Title title='Featured Vehicles'subTitle='Explore our selection of premium available
        available for your next adventure.'/>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {
            dummyBikeData.slice(0,6).map((bike)=>(
                <div key={bike._id}>
                    <BikeCard bike={bike}/>
                </div>
            ))
        }
      </div>
      <button onClick={()=>{navigate('/bike'); scrollTo(0,0)

      }}
      className='flex items-center justify-center gap-2 px-6 py-2 border 
      border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'>
        Explore all Bikes <img src={assets.arrow_icon} alt="arrow" />
      </button>
    </div>
  )
}

export default FeaturedSection

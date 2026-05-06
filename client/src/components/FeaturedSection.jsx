import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import BikeCard from './BikeCard'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { bikes } = useAppContext()

    return (

        <section className='bg-[#f5f7fb] px-6 md:px-16 lg:px-24 py-12'>

            {/* Header */}
            <div className='flex items-center justify-between mb-8 flex-wrap gap-4'>

                <div>

                    <p
                        className='text-blue-600 uppercase
                        text-sm font-semibold tracking-wider
                        mb-3'
                    >
                        Popular Bikes
                    </p>

                    <Title
                        title='Top Picks for Your Next Adventure'
                        subTitle=''
                    />

                </div>

                {/* View All */}
                <button

                    onClick={() => {
                        navigate('/bikes')
                        scrollTo(0, 0)
                    }}

                    className='hidden md:flex items-center gap-2
                    text-blue-600 font-medium hover:gap-3
                    transition-all'
                >

                    View all bikes

                    <img
                        src={assets.arrow_icon}
                        alt="arrow"
                        className='w-4'
                    />

                </button>

            </div>

            {/* Cards */}
            <motion.div

                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}

                transition={{
                    duration: 0.7
                }}

                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
            >

                {bikes.slice(0, 3).map((bike) => (

                    <motion.div

                        key={bike._id}

                        whileHover={{
                            y: -8
                        }}

                        transition={{
                            duration: 0.3
                        }}

                        className='bg-white rounded-[24px]
                        overflow-hidden border border-gray-100
                        shadow-sm hover:shadow-xl
                        transition-all duration-300'
                    >

                        <BikeCard bike={bike} />

                    </motion.div>

                ))}

            </motion.div>

        </section>
    )
}

export default FeaturedSection
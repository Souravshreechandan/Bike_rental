import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Testimonial = () => {

    const testimonials = [

        {
            name: "Saroj",
            location: "Bhubaneswar",
            image: assets.testimonial_image_1,
            testimonial:
                "I have rented bikes from various companies, but the experience with BikeRental was exceptional."
        },

        {
            name: "Soumya",
            location: "Cuttack",
            image: assets.testimonial_image_1,
            testimonial:
                "BikeRental made my trip so much easier. The bike was delivered right to my door, and the customer service was fantastic!"
        },

        {
            name: "Srikant",
            location: "Bhubaneswar",
            image: assets.testimonial_image_1,
            testimonial:
                "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results."
        }
    ]

    return (

        <section className="bg-[#f5f7fb] py-14 px-6 md:px-16 lg:px-24 overflow-hidden">

            {/* Heading */}
            <motion.div

                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}

                className="text-center"
            >

                <Title
                    title="What Our Customers Say"
                    subTitle="Real stories from real riders who trusted BikeRental for their journeys."
                />

            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

                {testimonials.map((testimonial, index) => (

                    <motion.div

                        key={index}

                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}

                        transition={{
                            duration: 0.6,
                            delay: index * 0.2,
                            ease: 'easeOut'
                        }}

                        viewport={{ once: true, amount: 0.3 }}

                        whileHover={{
                            y: -8,
                            transition: { duration: 0.3 }
                        }}

                        className="relative bg-white rounded-[28px]
                        p-8 shadow-lg hover:shadow-2xl
                        transition-all duration-500 overflow-hidden"
                    >

                        {/* Quote Icon */}
                        <div
                            className="absolute -bottom-5 right-5
                            text-[120px] text-gray-100 font-bold leading-none"
                        >
                            ”
                        </div>

                        {/* User */}
                        <div className="flex items-center gap-4">

                            <img
                                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                                src={testimonial.image}
                                alt={testimonial.name}
                            />

                            <div>

                                <h3 className="text-xl font-semibold text-gray-900">
                                    {testimonial.name}
                                </h3>

                                <p className="text-gray-500 text-sm">
                                    {testimonial.location}
                                </p>

                            </div>

                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mt-6">

                            {Array(5).fill(0).map((_, index) => (

                                <img
                                    key={index}
                                    src={assets.star_icon}
                                    alt="star-icon"
                                    className="w-5"
                                />

                            ))}

                        </div>

                        {/* Text */}
                        <p
                            className="text-gray-600 leading-8
                            mt-6 text-[15px] relative z-10"
                        >
                            "{testimonial.testimonial}"
                        </p>

                    </motion.div>

                ))}

            </div>

            {/* Slider Dots */}
            <div className="flex justify-center items-center gap-3 mt-14">

                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>

            </div>

        </section>
    )
}

export default Testimonial
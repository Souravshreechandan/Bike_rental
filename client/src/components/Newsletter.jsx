import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const Newsletter = () => {

    return (

        <motion.div

            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}

            transition={{
                duration: 0.6,
                ease: "easeOut"
            }}

            viewport={{ once: true, amount: 0.3 }}

            className="px-4 md:px-10 lg:px-16 py-3 bg-[#f5f7fb]"
        >

            {/* Main Container */}
            <div
                className="bg-[#020b22]
                rounded-[28px]
                px-6 md:px-10 py-6
                flex flex-col lg:flex-row
                items-center justify-between
                gap-8 overflow-hidden"
            >

                {/* Left Side */}
                <div className="flex items-center gap-5 w-full lg:w-auto">

                    {/* Icon */}
                    <div
                        className="min-w-16 min-h-16
                        rounded-full
                        bg-gradient-to-br from-[#0055ff] to-[#0033cc]
                        flex items-center justify-center
                        shadow-lg"
                    >

                        <img
                            src={assets.gmail_logo}
                            alt="mail"
                            className="w-8 h-8 brightness-0 invert"
                        />

                    </div>

                    {/* Text */}
                    <div>

                        <h2 className="text-white text-2xl font-bold">
                            Never Miss a Deal!
                        </h2>

                        <p className="text-white/70 mt-2 text-sm md:text-base">
                            Subscribe to get the latest offers,
                            new arrivals, and exclusive discounts.
                        </p>

                    </div>

                </div>

                {/* Right Side Form */}
                <motion.form

                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}

                    transition={{
                        delay: 0.3,
                        duration: 0.5
                    }}

                    className="w-full lg:max-w-xl"
                >

                    <div
                        className="bg-white rounded-2xl
                        overflow-hidden
                        flex flex-col sm:flex-row
                        items-center"
                    >

                        {/* Input */}
                        <input
                            type="email"
                            placeholder="Enter your email id"
                            required

                            className="flex-1 w-full
                            px-6 py-5
                            outline-none text-gray-600"
                        />

                        {/* Button */}
                        <button
                            type="submit"

                            className="bg-blue-600 hover:bg-blue-700
                            text-white font-semibold
                            px-10 py-5
                            w-full sm:w-auto
                            transition-all duration-300"
                        >
                            Subscribe
                        </button>

                    </div>

                </motion.form>

            </div>

        </motion.div>
    )
}

export default Newsletter
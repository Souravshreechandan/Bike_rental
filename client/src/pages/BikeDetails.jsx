import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import {motion} from 'motion/react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const BikeDetails = () => {

  const {id}=useParams()
  const {bikes, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  const navigate = useNavigate()
  const [bike,setBike]=useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async(e)=>{
    e.preventDefault();
//update for payment
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates")
      return
    }

    // Calculate total amount based on selected dates
    const picked = new Date(pickupDate)
    const returned = new Date(returnDate)
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    const totalAmount = bike.pricePerDay * noOfDays

    // Navigate to Payment page with bike info and total amount
    navigate("/payment", {
      state: {
        bike,
        totalAmount,
        pickupDate,
        returnDate
      }
    })
  }

  //   try {
  //     const {data} = await axios.post('/api/bookings/create', {
  //       bike: id,
  //       pickupDate,
  //       returnDate,
  //     })
  //     if(data.success){
  //       toast.success(data.message)
  //       navigate('/my-bookings')
  //     }else{
  //       toast.error(data.message)
  //     }
  //   } catch (error) {
  //     toast.error(error.message)
  //   }
  // }

  useEffect(()=>{
    setBike(bikes.find(bike => bike._id === id))
  },[bikes, id])
  
  return bike ? (
    
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=>navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500
       cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all bikes
      </button>
       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/*Left:Bike Image & Details*/}
        <motion.div 
        initial = {{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}

        className='lg:col-span-2'>
          <motion.img 
          initial = {{scale: 0.98, opacity:0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.5}}
          src={bike.image} alt="" className='w-full h-auto md:max-h-100 object-cover
          rounded-xl mb-6 shadow-md'/>
          <motion.div className='space-y-6'
          initial = {{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.2, duration: 0.5}}
          >
            <div>
              <h1 className='text-3xl font-bold'>{bike.brand} {bike.model}</h1>
              <p className='text-gray-500 text-lg'>{bike.category} • {bike.year}</p>
            </div>
            <hr className='border-borderColor my-6'/>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                {icon:assets.users_icon,text: `${bike.seating_capacity}Seats`},
                {icon: assets.fuel_icon, text:bike.fuel_type},
                {icon: assets.car_icon, text:bike.transmission},
                {icon: assets.location_icon, text:bike.location},
              ].map(({icon,text})=>(
                <motion.div 
                initial = {{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}

                key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt="" className='h-5 mb-2' />
                  {text}
                </motion.div>
              ))}
            </div>
            {/*Description*/}
            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{bike.description}</p>
            </div>
            {/*Features */}
            <div>
              <h1 className='text-xl font-medium mb-3'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {
                  ["GPS","Bluetooth"].map((item)=>(
                    <li key={item} className='flex items-center text-gray-500'>
                      <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                      {item}
                    </li>
                  ))
                }
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/*Right:Bike Image & Details*/}

        <motion.form 
        initial = {{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.3, duration: 0.6}}
        onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency} {bike.pricePerDay} <span className='text-base text-gray-400 font-normal'>
              per day</span></p>

          <hr className='border-borderColor my-6'/>

        
          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date'>Pickup Date</label>
            <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)}
            type="date" className='border border-borderColor px-3 py-2 rounded-lg' 
            required id='pickup-date' min={new Date().toISOString(). split('T')[0]} />
          </div>  

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}
            type="date" className='border border-borderColor px-3 py-2 rounded-lg' 
            required id='return-date'/>
          </div>

          <button className='w-full bg-primary hover:bg-primary-dull transition-all 
          py-3 font-medium text-white rounded-xl cursor-pointer'>Book Now</button>

          <p className='text-center text-sm'>We also accept partial payment</p>

        </motion.form>
      </div>
    </div>
  ): <Loader/>
}

export default BikeDetails

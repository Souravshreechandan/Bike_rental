import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import BikeCard from '../components/BikeCard'
import {motion} from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Bikes = () => {

  //getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation') 
  const pickupDate = searchParams.get('pickupDate') 
  const returnDate = searchParams.get('returnDate')
  
  const {bikes, axios} = useAppContext()
  
  const [input,setInput]= useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredBikes, setFilteredBikes] = useState([])

  const applyFilter = async()=>{
    if(input === ''){
      setFilteredBikes(bikes)
      return null
    }
    const filtered = bikes.slice().filter((bike)=>{
      return bike.brand.toLowerCase().includes(input.toLowerCase())
      || bike.model.toLowerCase().includes(input.toLowerCase())
      || bike.category.toLowerCase().includes(input.toLowerCase())
      || bike.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredBikes(filtered)
  }

  const searchBikeAvailablity = async ()=>{
    const {data} = await axios.post('/api/bookings/check-availability', 
    {location: pickupLocation, pickupDate, returnDate})
    if(data.success){
      setFilteredBikes(data.availableBikes)
      if(data.availableBikes.length === 0){
        toast('No bikes available')
      }
      return null
    }
  }
  useEffect(()=>{
    isSearchData && searchBikeAvailablity()
  },[])

  useEffect(()=>{
    bikes.length > 0 && !isSearchData && applyFilter()
  },[input,bikes])

  return (
    <div>
      <motion.div 
      initial = {{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease:"easeOut"}}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available bikes' subTitle='Browse our selection of premium 
        vehicles available for your next adventure'/>

        <motion.div 
        initial = {{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.3, duration: 0.5}}
        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />

          <input onChange={(e)=>setInput(e.target.value)} value={input} type="text"
          placeholder='Search by name,model,or features'
          className='w-full h-full outline-none text-gray-500'/>

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
        </motion.div>
      </motion.div>

      <motion.div 
      initial = {{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay:0.6,duration: 0.5}}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing 
          {filteredBikes.length} Bikes</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 
          xl:px-20 max-w-7xl mx-auto'>            
          {filteredBikes.map((bike,index)=>(

            <motion.div key={index}
            initial = {{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1 * index, duration:0.4}}
            >

              <BikeCard bike={bike}/>
            </motion.div>
        ))}
          </div>
      </motion.div> 
    </div>
  )
}

export default Bikes

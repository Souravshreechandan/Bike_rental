import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBikes = () => {

  const {isOwner,axios,currency}= useAppContext()

  const [bikes,setBikes]=useState([])

  // here it will fetch owner bike
  const fetchOwnerBikes=async ()=>{
    try {
      const {data} = await axios.get('/api/owner/bikes')
      if(data.success){
        setBikes(data.bikes)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // here the status will change
  const toggleAvailability =async (bikeId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-bike',{bikeId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBikes()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // here if owner want then can delete the bike
  const deleteBike = async (bikeId)=>{
    try {
      const confirm = window.confirm("Are you sure you want to delete this bike")

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-bike', {bikeId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBikes()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    isOwner && fetchOwnerBikes()
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bikes" subTitle="view all listed bikes, update their details,
      or remove them from the booking platform."/>

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-600'>
            <tr>
            <th className='p-3 font-medium'>Bike</th>
            <th className='p-3 font-medium max-md:hidden'>Category</th>
            <th className='p-3 font-medium'>Price</th>
            <th className='p-3 font-medium max-md:hidden'>Status</th>
            <th className='p-3 font-medium'>Actions</th>
          </tr>
          </thead>
          <tbody>
            {bikes.map((bike,index)=>(
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={bike.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{bike.brand} {bike.model}</p>
                    <p className='text-xs text-gray-500'>{bike.seating_capacity}•{bike.transmission}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{bike.category}</td>
                <td className='p-3'>{currency}{bike.pricePerDay}/day</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${bike.isAvailable ? 
                  'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {bike.isAvailable ? "Available":"unavailable"}
                  </span>
                </td>

                <td className='flex items-center p-3'>
                  <img onClick={()=> toggleAvailability(bike._id)} src={bike.isAvailable ? assets.eye_close_icon : 
                    assets.eye_icon} alt="" className='cursor-pointer' />

                  <img onClick={()=> deleteBike(bike._id)} src={assets.delete_icon} alt="" className='cursor-pointer'/>  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default ManageBikes

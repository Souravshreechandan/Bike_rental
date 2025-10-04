import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddBike = () => {

    const {axios,currency} = useAppContext()

    const [image,setImage]=useState(null)
    const [bike,setBike]=useState({
        brand:'',
        model:'',
        year:0,
        pricePerDay:0,
        category:'',
        transmission:'',
        fuel_type:'',
        seating_capacity:'',
        location:'',
        description:'',
    })
    const [isLoading, setIsLoading] = useState(false)
    const onSubmitHandeler = async(e)=>{
        e.preventDefault();
        if(isLoading) return null

        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('image' , image)
            formData.append('bikeData', JSON.stringify(bike))

            const {data} = await axios.post('/api/owner/add-bike', formData)

            if(data.success){
                toast.success(data.message)
                setImage(null)
                setBike({
                    brand:'',
                    model:'',
                    pricePerDay:0,
                    year:0,
                    transmission:'',
                    category:'',
                    seating_capacity:'',
                    fuel_type:'',
                    description:'',
                    location:'',
                })
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setIsLoading(false)
        }
     }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
        <Title title='Add New Bike' subTitle='fill in details to list a new bike for booking
        including pricing,availability, and bike specification.'/>
        <form onSubmit={onSubmitHandeler} className='flex flex-col gap-5 text-gray-500
        test-sm mt-6 max-w-xl'>

            {/* {bike image} */}
            <div className='flex items-center gap-2 w-full'>
                <label htmlFor="bike-image">
                    <img src={image ? URL.createObjectURL(image):assets.upload_icon} alt=""  
                    className='h-14 rounded cursor-pointer'/>
                    <input type="file" id='bike-image' accept='image/*' hidden onChange={e=>setImage(e.target.files[0])}/>
                </label>
                <p className='text-sm text-gray-500'>Upload a picture of your bike</p>
            </div>

            {/* {bike brand and model} */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col w-full'>
                    <label>Brand</label>
                    <input type="text" placeholder='e.g. BMW,Kawashaki...' required 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md 
                    outline-none' value={bike.brand} onChange={e=>setBike({...bike, brand: e.target.value})}/>
                </div>
                
                <div className='flex flex-col w-full'>
                    <label>Model</label>
                    <input type="text" placeholder='e.g. Top,high...' required 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md 
                    outline-none' value={bike.model} onChange={e=>setBike({...bike,model:e.target.value})}/>
                </div>

            </div>

            {/* {bike year,price ,category} */}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='flex flex-col w-full'>
                    <label>Year</label>
                    <input type="number" placeholder='2025' required 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md 
                    outline-none' value={bike.year} onChange={e=>setBike({...bike,year:e.target.value})}/>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Daily Price</label>
                    <input type="number" placeholder='100' required 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md 
                    outline-none' value={bike.pricePerDay} onChange={e=>setBike({...bike, pricePerDay:e.target.value})}/>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Category</label>

                    <select onChange={e=>setBike({...bike,category:e.target.value})} 
                    value={bike.category} 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>

                        <option value="">Select a category</option>
                        <option value="OIL">OIL</option>
                        <option value="EV">EV</option>
                    </select>
                </div>
            </div>

            {/* {bike transmission,fuel type seating capacity} */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='flex flex-col w-full'>
                    <label>Transmission</label>

                    <select onChange={e=>setBike({...bike,transmission:e.target.value})} 
                    value={bike.transmission} 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>

                        <option value="">Select a transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>

                 <div className='flex flex-col w-full'>
                    <label>Fuel type</label>

                    <select onChange={e=>setBike({...bike,fuel_type:e.target.value})} 
                    value={bike.fuel_type} 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>

                        <option value="">Select fuel type</option>
                        <option value="Gas">Gas</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                    </select>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Seating Capacity</label>
                    <input type="number" placeholder='2' required 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md 
                    outline-none' value={bike.seating_capacity} onChange={e=>setBike({...bike,seating_capacity:e.target.value})}/>
                </div>
            </div>

            {/* {bike location} */}

             <div className='flex flex-col w-full'>
                    <label>Location</label>

                    <select onChange={e=>setBike({...bike,location:e.target.value})} 
                    value={bike.location} 
                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>

                        <option value="">Locaion</option>
                        <option value="Bhubaneswar">Bhubaneswar</option>
                        <option value="Cuttack">Cuttack</option>
                    </select>
                </div>
                {/* {car description} */}

                <div className='flex flex-col w-full'>
                    <label>Description</label>
                    <textarea rows={5} placeholder='.....' required className='px-3 py-2 mt-1 border
                     border-borderColor rounded-md outline-none' 
                     value={bike.description} onChange={e=>setBike({...bike, description:e.target.value})}> </textarea>
                </div>

                <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary
                text-white rounded-md font-medium w-max cursor-pointer'>
                    <img src={assets.tick_icon} alt="" />
                    {isLoading ? 'Listing...' : 'List Your Bike'}
                </button>

        </form>
      
    </div>
  )
}

export default AddBike

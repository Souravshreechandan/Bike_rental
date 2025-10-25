import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const BikeDetails = () => {
  const { id } = useParams();
  const { bikes, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
  const navigate = useNavigate();

  const [bike, setBike] = useState(null);
  const [step, setStep] = useState(1); // Step 1 = dates, Step 2 = address+hub, Step 3 = payment
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hub, setHub] = useState('');
  const [hubs, setHubs] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;

  // Set bike data
  useEffect(() => {
    setBike(bikes.find(b => b._id === id));
  }, [bikes, id]);

  // Fetch hubs
  useEffect(() => {
    if (step === 2 && hubs.length === 0) {
      axios.get('/api/hubs')
        .then(res => setHubs(res.data.hubs || []))
        .catch(err => toast.error(err.message));
    }
  }, [step]);

  // Step 1: Dates submit
  const handleDatesSubmit = (e) => {
    e.preventDefault();
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }
    setStep(2);
  };

  // Step 2: Address & Hub submit
  const handleAddressHubSubmit = (e) => {
    e.preventDefault();
    if (!address || !phone || !hub) {
      toast.error("Please enter address, phone, and select a hub");
      return;
    }
    setStep(3);
  };

  // Step 3: Payment
  const handlePayment = () => {
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const totalAmount = bike.pricePerDay * noOfDays;

    navigate("/payment", {
      state: {
        bike,
        totalAmount,
        pickupDate,
        returnDate,
        address,
        phone,
        hub
      }
    });
  };

  if (!bike) return <Loader />;

  // Dynamic price
  const noOfDays = pickupDate && returnDate
    ? Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000*60*60*24))
    : 0;
  const totalAmount = bike.pricePerDay * (noOfDays > 0 ? noOfDays : 0);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back to all bikes
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Bike Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='lg:col-span-2'
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={bike.image} alt=""
            className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
          />
          <motion.div className='space-y-6' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div>
              <h1 className='text-3xl font-bold'>{bike.brand} {bike.model}</h1>
              <p className='text-gray-500 text-lg'>{bike.category} • {bike.year}</p>
            </div>
            <hr className='border-borderColor my-6' />
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[{ icon: assets.users_icon, text: `${bike.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: bike.fuel_type },
                { icon: assets.car_icon, text: bike.transmission },
                { icon: assets.location_icon, text: bike.location }
              ].map(({ icon, text }) => (
                <motion.div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <img src={icon} alt="" className='h-5 mb-2' />
                  {text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.div className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Step 1: Dates */}
          {step === 1 && (
            <form onSubmit={handleDatesSubmit} className='space-y-4'>
              <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                {currency} {bike.pricePerDay} <span className='text-base text-gray-400 font-normal'>per day</span>
              </p>
              {noOfDays > 0 && (
                <p className='text-gray-500'>Total: {currency} {totalAmount} ({bike.pricePerDay} × {noOfDays} {noOfDays > 1 ? 'days' : 'day'})</p>
              )}
              <div className='flex flex-col gap-2'>
                <label>Pickup Date</label>
                <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className='border border-borderColor px-3 py-2 rounded-lg' required />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Return Date</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split('T')[0]} className='border border-borderColor px-3 py-2 rounded-lg' required />
              </div>
              <button type="submit" className='w-full bg-primary hover:bg-primary-dull py-3 text-white rounded-xl'>Next</button>
            </form>
          )}

          {/* Step 2: Address & Hub */}
          {step === 2 && (
            <form onSubmit={handleAddressHubSubmit} className='space-y-4'>
              <div className='flex flex-col gap-2'>
                <label>Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your address" className='border border-borderColor px-3 py-2 rounded-lg' required />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" className='border border-borderColor px-3 py-2 rounded-lg' required />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Select Hub</label>
                <select value={hub} onChange={e => setHub(e.target.value)} className='border border-borderColor px-3 py-2 rounded-lg' required>
                  <option value="">Select a hub</option>
                  {hubs.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              <div className='flex gap-2'>
                <button type="submit" className='w-full bg-primary hover:bg-primary-dull py-3 text-white rounded-xl'>Next</button>
                <button type="button" onClick={() => setStep(1)} className='w-full bg-gray-300 py-3 rounded-xl'>Back</button>
              </div>
            </form>
          )}

          {/* Step 3: Review & Payment */}
          {step === 3 && (
            <div className='space-y-4'>
              <p className='text-gray-800 font-semibold text-lg'>
                Total: {currency} {totalAmount} ({bike.pricePerDay} × {noOfDays} {noOfDays > 1 ? 'days' : 'day'})
              </p>
              <button onClick={handlePayment} className='w-full bg-primary hover:bg-primary-dull py-3 text-white rounded-xl'>Proceed to Payment</button>
              <button onClick={() => setStep(2)} className='w-full bg-gray-300 py-3 rounded-xl'>Back</button>
            </div>
          )}

          <p className='text-center text-sm'>We also accept partial payment</p>
        </motion.div>
      </div>
    </div>
  );
};

export default BikeDetails;

import mongoose from 'mongoose';
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js"



// function to check availability of car for a given place
const checkAvailability = async (bike,pickupDate,returnDate)=>{
    const bookings = await Booking.find({
        bike,
        pickupDate:{$lte:returnDate},
        returnDate:{$gte:pickupDate},
    })
    return bookings.length === 0;
}

//Api to check availability of bikes for the given location
export const checkAvailabilityOfBike = async (req,res)=>{
    try {
        const {location, pickupDate, returnDate}= req.body

        //fetch all available bikes for the given location
        const bikes = await Bike.find({location,isAvailable:true})

        //check bike availability for the given date range using promise
        const availableBikesPromises = bikes.map(async(bike)=>{
            const isAvailable = await checkAvailability(bike._id,pickupDate,returnDate)
            return{...bike._doc, isAvailable: isAvailable}
        })

        let availableBikes = await Promise.all(availableBikesPromises)
        availableBikes = availableBikes.filter(bike=>bike.isAvailable === true)

        res.json({success:true, availableBikes})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

//api to create booking
export const createBooking= async(req,res)=>{
    try {
        const {_id} =req.user;
        const{
            bike,
            pickupDate,
            returnDate,
            paymentMethod = "offline", // default if not provided
            paidAmount = 0, // amount user pays now
        }=req.body;

        const isAvailable = await checkAvailability(bike,pickupDate,returnDate)
        if(!isAvailable){
            return res.json({success:false,message:"Bike is not available"})
        }
        const bikeData = await Bike.findById(bike)

        // calculate price based on pickupDate and returnDate
        const picked =  new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned-picked)/(1000*60*60*24))

        //  UPDATED: calculate totalAmount
        const totalAmount = bikeData.pricePerDay * noOfDays;

        // Calculate pending amount and status
        const pendingAmount = totalAmount - paidAmount;
        const paymentStatus =
            paidAmount === 0
                ? "unpaid"
                : pendingAmount === 0
                ? "paid"
                : "partial";


        const booking = await Booking.create(
            {
                bike, 
                owner: bikeData.owner, 
                user: _id,
                pickupDate, 
                returnDate, 
                price: totalAmount,paymentMethod,paidAmount,pendingAmount,paymentStatus,
               
            })

        res.json({success: true, message: "Booking Created", booking})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//Api to get list of  user booking

export const getUserBookings = async (req,res)=>{
    try {
      const { _id } = req.user;
      const bookings = await Booking.find({user: _id})
      .populate("bike")
      .sort({createdAt:-1})
       console.log('user Bookings:', bookings);
      res.json({success:true,bookings})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//Api to get owner bookings

export const getOwnerBookings = async(req,res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({success:false, message:"Unauthorized"})
        }
         // Fetch bookings for this owner and populate properly

        const bookings = await Booking.find({owner: req.user._id})

        .populate("bike user","-user.password")
        .sort({createdAt: -1})

        // 🔹 UPDATED: ensure paymentStatus and pendingAmount are sent
        const formattedBookings = bookings.map(b => ({
            ...b._doc,
            paymentStatus: b.paymentStatus || 'unpaid',
            pendingAmount: b.pendingAmount || b.price
        }))
        
        console.log('get Owner Bookings:', bookings);

        res.json({success:true, bookings: formattedBookings })
    
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})     
    }
}

//Api to change booking status

export const changeBookingStatus= async (req,res)=>{
    try {
        const{_id}=req.user;
        const {bookingId, status}=req.body

        const booking = await Booking.findById(bookingId)

        // if(booking.owner.toString() !== _id.toString()){
        //     return res.json({success:false, message:"Unauthorized"})
        // }
        // booking.status = status;
        if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // Check if the logged-in user is the owner
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;

    // If owner cancels, refund the payment
    if (status.toLowerCase() === "cancelled") {
      if (booking.paymentStatus === "paid" || booking.paymentStatus === "partial") {
        booking.paymentStatus = "refunded";
        booking.pendingAmount = 0 //  set pending to 0 when refunded
      }
    }
        await booking.save();

        res.json({success:true, message:"Status updated"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// API to pay remaining amount
export const payRemaining = async (req, res) => {
  try {
    const { bookingId, amount, razorpayPaymentId } = req.body;

    if (!bookingId || !amount) {
      return res.json({ success: false, message: "Booking ID and amount are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // Ensure numeric values
    const payment = Number(amount);
    booking.paidAmount = Number(booking.paidAmount) + payment;
    booking.pendingAmount = Number(booking.price) - booking.paidAmount;

    // Store Razorpay payment ID if available
    if (razorpayPaymentId) {
      booking.razorpayPaymentId = razorpayPaymentId;
    }

    // Update payment status
    if (booking.paidAmount >= Number(booking.price)) {
      booking.paymentStatus = "paid";
      booking.paidAmount = Number(booking.price);
      booking.pendingAmount = 0;
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();

    res.json({ success: true, message: "Payment updated", booking });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
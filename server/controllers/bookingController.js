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
export const checkAvailabilityOfBikes = async (req,res)=>{
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
        const{bike,pickupDate,returnDate}=req.body;

        const isAvailable = await checkAvailability(bike,pickupDate,returnDate)
        if(!isAvailable){
            return res.json({success:false,message:"Bike is not available"})
        }
        const bikeData = await Bike.findById(bike)

        // calculate price based on pickupDate and returnDate
        const picked =  new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned-picked)/(1000*60*60*24))
        const price = bikeData.pricePerDay * noOfDays;

        await Booking.create({bike, owner: bikeData.owner, user: _id, pickupDate, returnDate, price })// update

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//Api to list user booking

export const getUserBookings = async (req,res)=>{
    try {
      const {_id} = req.user;
      const bookings = await Booking.find({user: _id})
      .populate("bike")
      .sort({createdAt:-1})
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
            return res.json({success:false,message:"Unauthorized"})
        }
        const bookings = await Booking.find({owner: req.user._id})
        .populate('bike user').select("-user.password")
        .sort({createdAt:-1})
        res.json({success:true,bookings})
    
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

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }
        booking.status = status;
        await booking.save();

        res.json({success:true, message:"Status updated"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


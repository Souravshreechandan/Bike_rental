import imagekit from "../configs/imageKit.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import fs from 'fs'

//api to change role of user
export const changeRoleToOwner = async(req,res)=>{
    try {
        const{_id}= req.user;
        await User.findByIdAndUpdate(_id,{role:"owner"})
        res.json({success:true, message:"Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//api to list car

export const addBike = async(req,res)=>{
    try {
        const {_id} = req.user
        let bike = JSON.parse(req.body.bikeData);
        const imageFile = req.file;

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder:"/bikes"
        })

        // optimization through imagekit URL transformation 
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, //width resizing
                {quality: 'auto'}, // auto compression
                {format: 'webp'} //convert to mordern format
            ]
        });

        const image = optimizedImageUrl;
        await Bike.create({...bike, owner: _id, image})

        res.json({success: true, message: 'Bike Added'})

        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

//api to list owner bikes

export const getOwnerBikes = async(req,res)=>{
    try {
        const{_id} = req.user;
        const bikes = await Bike.find({owner: _id})
        res.json({ success: true, bikes }); //
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//api to toggle bike availability

export const toggleBikeAvailability= async(req,res)=>{
    try {
        const{_id} = req.user;
        const {bikeId}= req.body
        const bike = await Bike.findById(bikeId)

        //checking is bike belongs to he user
        if(bike.owner.toString() !== _id.toString()){
            return  res.json({success:false,message:"Unauthorized"})
        }
        bike.isAvailable = !bike.isAvailable
        await bike.save()

        res.json({success:true,message:'Availability Toggled'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//api to delete bike 

export const deleteBike= async(req,res)=>{
    try {
        const{_id} = req.user;
        const {bikeId}= req.body
        const bike = await Bike.findById(bikeId)

        //checking is bike belongs to he user
        if(bike.owner.toString() !== _id.toString()){
            return  res.json({success:false,message:"Unauthorized"})
        }
        bike.owner = null
        bike.isAvailable = false
        await bike.save()

        res.json({success:true,message:'Bike Removed'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//api to get dashboard data
export const getDashboardData = async (req,res)=>{
    try {
        const {_id,role}=req.user

        if(role !== 'owner'){
            return res.json({success:false,message: "Unauthorized"})
        }
        const bikes = await Bike.find({owner: _id})
        const bookings = await Booking.find({owner: _id})
        .populate('bike')
        .sort({createdAt: -1});

        const pendingBookings = await Booking.find({owner: _id, status:"pending"})
        const completedBookings = await Booking.find({owner: _id, status:"confirmed"})

        //calculate monthly revenue from bookings where status is confirmed

        const monthlyRevenue = bookings.slice().filter(booking => booking.
        status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            
            totalBikes: bikes.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({success:true, dashboardData});

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//Api to update user image

export const updateUserImage = async(req,res)=>{
    try {
        const{_id} = req.user;
         const imageFile = req.file;

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder:"/users"
        })

        // optimization through imagekit URL transformation 
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, //width resizing
                {quality: 'auto'}, // auto compression
                {format: 'webp'} //convert to mordern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id,{image});
        res.json({success:true,message:"Image Updated"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

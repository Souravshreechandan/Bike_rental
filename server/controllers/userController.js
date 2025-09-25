import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Bike from "../models/Bike.js";

//generate jwt token

const generateTokan = (userId)=>{
    const payload = userId;
    return jwt.sign(payload,process.env.JWT_SECRET)

}
// register user

export const registerUser = async(req,res)=>{
    try {
        const{ name,email,password} = req.body
        if(!name || !email || !password  || password.length <8){
            return res.json({success:false, message:'fill all the fields'})
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return res.json({success:false, message:'User aleardy exists'})
        } 
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create ({name,email,password: hashedPassword})
        const token = generateTokan(user._id.toString())
        res.json({success:true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

//login user

export const loginUser = async (req,res)=>{
    try {
        const {email,password}=req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json ({success: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false, message:"invalid Credentials"})
        }
        const token = generateTokan(user._id.toString())
        res.json({success: true,token})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// get user data using token (jwt)

export const getUserData = async(req,res)=>{
    try {
        const{user} =req;
        res.json({success:true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//get all bikes for the frontend

export const getBikes= async(req,res)=>{
    try {
        const bikes = await Bike.find({isAvaliable: true})
        res.json({success: true, bikes})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

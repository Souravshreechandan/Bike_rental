import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    bike: {type: ObjectId, ref:"Bike", required:true},
    user: {type: ObjectId, ref:"User", required:true},
    owner: {type: ObjectId, ref:"User", required:true}, 
    pickupDate: {type: Date, required:true},
    returnDate: {type: Date, required:true},
    status: {type: String, enum:["pending","confirmed","cancelled"],default:"pending"},
    price: {type: Number, required:true},

    //  New payment fields
    paymentMethod: {type: String,enum: ["offline", "online"],default: "offline",},
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    paymentStatus: {type: String,enum: ["unpaid", "partial", "paid"],default: "unpaid", },

}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

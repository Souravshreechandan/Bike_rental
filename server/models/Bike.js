import mongoose, { model } from "mongoose";

const {objectId} = mongoose.Schema.Types

const bikeSchema = new mongoose.Schema({
    owner:{type: objectId, ref:"User"},
    brand:{type: String, require:true},
    model:{type: String, require:true},
    Image:{type: String, require:true},
    year:{type: Number, require:true},
    category:{type: String, require:true},
    seating_capacity:{type: Number, require:true},
    fuel_type:{type: String, require:true},
    transmission:{type: String, require:true},
    pricePerDay:{type: Number, require:true},
    location:{type: String, require:true},
    description:{type: String, require:true},
    isAvaliable:{type: Boolean, default:true}, 

},{timestamps:true})

const Bike = mongoose.model('Bike', bikeSchema)

export default Bike;
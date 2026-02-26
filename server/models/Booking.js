import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    bike: { type: ObjectId, ref: "Bike", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },

    // 📅 Date Fields
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    // TIME SLOT FIELDS
    pickupSlot: {
      type: String,
      required: true, 
    },
    returnSlot: {
      type: String,
      required: true, 
    },

    // HOURLY BOOKING FIELD
    totalHours: {
      type: Number,
      required: true,
      default: 1,
    },

    price: { type: Number, required: true },

    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // Payment Fields
    paymentMethod: {
      type: String,
      enum: ["offline", "online"],
      default: "offline",
    },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },

    address: { type: String },
    phone: { type: String },
    hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub" },
    pickupLocation: { type: String },

    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
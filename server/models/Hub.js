import mongoose from "mongoose";

const hubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    capacity: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    openTime: { type: String, default: "09:00" },
    closeTime: { type: String, default: "18:00" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Hub", hubSchema);

import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

const getHourFromSlot = (slot) => {
  if (!slot) return 0;
  return parseInt(slot.split(":")[0]);
};

const getDateTime = (date, slot) => {
  const hour = getHourFromSlot(slot);
  return new Date(`${date}T${hour}:00:00`);
};

// Slot + Status + Time based availability check
const checkAvailability = async (
  bike,
  pickupDate,
  returnDate,
  pickupSlot,
  returnSlot
) => {
  // Only active booking will block
  const bookings = await Booking.find({
    bike,
    status: { $in: ["pending", "confirmed"] },
  });

  const newPickupDateTime = getDateTime(pickupDate, pickupSlot);
  const newReturnDateTime = getDateTime(returnDate, returnSlot);

  for (let booking of bookings) {
    // Skip old bookings without slots
    if (!booking.pickupSlot || !booking.returnSlot) continue;

    const existingPickupDateTime = getDateTime(
      booking.pickupDate.toISOString().split("T")[0],
      booking.pickupSlot
    );

    const existingReturnDateTime = getDateTime(
      booking.returnDate.toISOString().split("T")[0],
      booking.returnSlot
    );

    const isOverlapping =
      newPickupDateTime < existingReturnDateTime &&
      newReturnDateTime > existingPickupDateTime;

    if (isOverlapping) {
      return false;
    }
  }

  return true;
};

export const getBookedSlots = async (req, res) => {
  try {
    const { bikeId, date } = req.body;

    if (!bikeId || !date) {
      return res.json({
        success: false,
        message: "Bike ID and date are required",
      });
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      bike: bikeId,
      pickupDate: { $lte: endOfDay },
      returnDate: { $gte: startOfDay },
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedSlots = [];

    bookings.forEach((booking) => {
      if (booking.pickupSlot) bookedSlots.push(booking.pickupSlot);
      if (booking.returnSlot) bookedSlots.push(booking.returnSlot);
    });

    res.json({
      success: true,
      bookedSlots,
    });
  } catch (error) {
    console.log("getBookedSlots Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API  to Check availability of bikes for location + slot
export const checkAvailabilityOfBike = async (req, res) => {
  try {
    const { location, pickupDate, returnDate, pickupSlot, returnSlot } =
      req.body;

    const bikes = await Bike.find({ location, isAvailable: true });

    const availableBikesPromises = bikes.map(async (bike) => {
      const isAvailable = await checkAvailability(
        bike._id,
        pickupDate,
        returnDate,
        pickupSlot,
        returnSlot
      );
      return { ...bike._doc, isAvailable };
    });

    let availableBikes = await Promise.all(availableBikesPromises);
    availableBikes = availableBikes.filter(
      (bike) => bike.isAvailable === true
    );

    res.json({ success: true, availableBikes });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to create booking (Hourly + Slot + Correct Pricing)
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;

    const {
      bike,
      pickupDate,
      returnDate,
      pickupSlot,
      returnSlot,
      paymentMethod = "offline",
      paidAmount = 0,
      address,
      phone,
      hubId,
      pickupLocation,
    } = req.body;

    //  VALIDATION
    if (!pickupSlot || !returnSlot) {
      return res.json({
        success: false,
        message: "Pickup and return time slots are required",
      });
    }

    // SLOT-BASED AVAILABILITY CHECK
    const isAvailable = await checkAvailability(
      bike,
      pickupDate,
      returnDate,
      pickupSlot,
      returnSlot
    );

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Bike is already booked for the selected time slot",
      });
    }

    const bikeData = await Bike.findById(bike);
    if (!bikeData) {
      return res.json({ success: false, message: "Bike not found" });
    }

    const pickupDateTime = getDateTime(pickupDate, pickupSlot);
    const returnDateTime = getDateTime(returnDate, returnSlot);

    // Calculate total hours (minimum 1 hour)
    let totalHours = Math.ceil(
      (returnDateTime - pickupDateTime) / (1000 * 60 * 60)
    );

    if (totalHours <= 0) totalHours = 1;

    //  HOURLY PRICE (Fixes ₹0 + wrong price issue)
    const hourlyRate = bikeData.pricePerDay;
    const totalAmount = hourlyRate * totalHours;

    // Payment logic
    const paid = Number(paidAmount) || 0;
    const pendingAmount = totalAmount - paid;

    let paymentStatus = "unpaid";
    if (paid === 0) paymentStatus = "unpaid";
    else if (pendingAmount <= 0) paymentStatus = "paid";
    else paymentStatus = "partial";

    const booking = await Booking.create({
      bike,
      owner: bikeData.owner,
      user: _id,
      pickupDate,
      returnDate,
      pickupSlot,
      returnSlot,
      totalHours,
      price: totalAmount,
      paidAmount: paid,
      pendingAmount,
      paymentStatus,
      paymentMethod,
      address,
      phone,
      hub: hubId,
      pickupLocation,
      status: "pending",
    });

    res.json({
      success: true,
      message: "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    console.log("createBooking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("bike")
      .populate("hub")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log("getUserBookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

//  API to Get owner bookings (FIXES YOUR SERVER ERROR)
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("bike user", "-password")
      .populate("hub")
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => ({
      ...b._doc,
      paymentStatus: b.paymentStatus || "unpaid",
      pendingAmount:
        b.pendingAmount !== undefined ? b.pendingAmount : b.price,
    }));

    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.log("getOwnerBookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Change booking status (Admin/Owner)
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;

    // If it cancelled slot automatically becomes available
    if (status.toLowerCase() === "cancelled") {
      if (
        booking.paymentStatus === "paid" ||
        booking.paymentStatus === "partial"
      ) {
        booking.paymentStatus = "refunded";
        booking.pendingAmount = 0;
      }
    }

    await booking.save();

    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log("changeBookingStatus Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Pay remaining amount
export const payRemaining = async (req, res) => {
  try {
    const { bookingId, amount, razorpayPaymentId } = req.body;

    if (!bookingId || !amount) {
      return res.json({
        success: false,
        message: "Booking ID and amount are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const payment = Number(amount);

    booking.paidAmount = Number(booking.paidAmount) + payment;
    booking.pendingAmount = Number(booking.price) - booking.paidAmount;

    if (razorpayPaymentId) {
      booking.razorpayPaymentId = razorpayPaymentId;
    }

    if (booking.paidAmount >= Number(booking.price)) {
      booking.paymentStatus = "paid";
      booking.paidAmount = Number(booking.price);
      booking.pendingAmount = 0;
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();

    res.json({
      success: true,
      message: "Payment updated",
      booking,
    });
  } catch (error) {
    console.log("payRemaining Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
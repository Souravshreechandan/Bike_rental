import express from 'express';
import { protect } from "../middleware/auth.js";
import { changeBookingStatus, checkAvailabilityOfBikes, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfBikes)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status',protect,changeBookingStatus)

export default bookingRouter;
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  // Fetch user's bookings
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  // Handle paying remaining amount via Razorpay
  const handlePayRemaining = async (bookingId, amount) => {
    if (amount < 25) {
      toast.error(`Minimum online payment is ${currency}25`);
      return;
    }

    const confirmPayment = window.confirm(
      `Do you want to pay ${currency}${amount} now?`
    );
    if (!confirmPayment) return;

    try {
      // 1️⃣ Create Razorpay order from backend
      const orderRes = await axios.post("/api/payment/create-order", { amount });
      const orderData = orderRes.data;

      // 2️⃣ Configure Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // public key from .env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bike Booking",
        description: "Payment for remaining amount",
        order_id: orderData.id,
        handler: async function (response) {
          // 3️⃣ After successful payment, update booking
          const { data } = await axios.post("/api/bookings/pay-remaining", {
            bookingId,
            amount,
            razorpayPaymentId: response.razorpay_payment_id,
          });

          if (data.success) {
            toast.success("Payment successful!");
            fetchMyBookings();
          } else {
            toast.error(data.message || "Payment failed!");
          }
        },
        prefill: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#3B82F6",
        },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Payment failed!"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your bike bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Bike Image + Info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.bike.image}
                  alt={`${booking.bike.brand} ${booking.bike.model}`}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.bike.brand} {booking.bike.model}
              </p>
              <p className="text-gray-500">
                {booking.bike.year} • {booking.bike.category} • {booking.bike.location}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">Booking #{index + 1}</p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4" />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} To {booking.returnDate.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img src={assets.location_icon_colored} alt="" className="w-4 h-4" />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.bike.location}</p>
                </div>
              </div>
            </div>

            {/* Price + Payment Info */}
            <div className="md:col-span-1 flex flex-col justify-between text-right">
              <div className="text-sm text-gray-500">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}{booking.price}
                </h1>
                <p>Booked on {booking.createdAt.split("T")[0]}</p>
              </div>

              <div className="mt-4 flex flex-col items-end gap-1">
                {/* Paid */}
                {booking.paymentStatus === "paid" && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Paid: {currency}{booking.paidAmount}
                  </span>
                )}

                {/* Partial */}
                {booking.paymentStatus === "partial" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Partially Paid: {currency}{booking.paidAmount}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Remaining: {currency}{booking.pendingAmount}
                      </span>
                      {booking.paymentMethod === "online" && (
                        <button
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-all"
                          onClick={() =>
                            handlePayRemaining(booking._id,Number(booking.pendingAmount))
                          }
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Unpaid */}
                {booking.paymentStatus === "unpaid" && (
                  <>
                    {booking.paymentMethod === "offline" ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        To be paid in cash
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          Unpaid: {currency}{booking.pendingAmount}
                        </span>
                        <button
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-all"
                          onClick={() =>
                            handlePayRemaining(booking._id, booking.pendingAmount)
                          }
                        >
                          Pay
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Refunded */}
                {booking.paymentStatus === "refunded" && (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Refunded: {currency}{booking.paidAmount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBookings;

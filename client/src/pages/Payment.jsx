import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Payment = () => {
  const { axios, currency } = useAppContext();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Destructure all fields from state
  const { bike, totalAmount, pickupDate, returnDate, address, phone, hub } = state;

  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [payNow, setPayNow] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates.");
      return;
    }

    if (!address || !phone || !hub) {
      toast.error("Please provide address, phone, and select hub.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "offline") {
        // Offline booking
        const res = await axios.post("/api/bookings/create", {
          bike: bike._id,
          pickupDate,
          returnDate,
          paidAmount: 0,
          paymentMethod,
          address,
          phone,
          hubId: hub, // match backend field
        });

        if (res.data.success) {
          toast.success("Booking successful!");
          navigate("/my-bookings");
        } else {
          toast.error(res.data.message || "Booking failed!");
        }
      } else {
        // Online payment using Razorpay
        const orderRes = await axios.post("/api/payment/create-order", { amount: payNow });
        const orderData = orderRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Bike Booking",
          description: `Payment for ${bike.brand} ${bike.model}`,
          order_id: orderData.id,
          handler: async function (response) {
            const bookingRes = await axios.post("/api/bookings/create", {
              bike: bike._id,
              pickupDate,
              returnDate,
              paidAmount: payNow,
              paymentMethod: "online",
              address,
              phone,
              hubId: hub,
            });

            if (bookingRes.data.success) {
              toast.success("Booking successful!");
              navigate("/my-bookings");
            } else {
              toast.error(bookingRes.data.message || "Booking failed!");
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: { color: "#3B82F6" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Payment for {bike.brand} {bike.model}
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Total Amount:</p>
        <p className="text-xl font-semibold text-primary">{currency} {totalAmount}</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="offline">Offline (Cash after ride)</option>
          <option value="online">Online</option>
        </select>
      </div>

      {paymentMethod === "online" && (
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Pay Now: {currency} {payNow}
          </label>
          <input
            type="range"
            min="0"
            max={totalAmount}
            value={payNow}
            onChange={(e) => setPayNow(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       accent-blue-500 transition-all hover:scale-y-125"
            style={{ accentColor: "#3B82F6" }}
          />
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>0</span>
            <span>{totalAmount}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 rounded-full text-white font-medium transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default Payment;

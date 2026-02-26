import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Payment = () => {
  const { axios, currency } = useAppContext();
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    bike,
    totalAmount,
    pickupDate,
    returnDate,
    pickupSlot,   
    returnSlot,   
    address,
    phone,
    hub,
  } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [payNow, setPayNow] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!pickupDate || !returnDate || !pickupSlot || !returnSlot) {
      toast.error("Missing booking time slot details.");
      return;
    }

    if (!address || !phone || !hub) {
      toast.error("Please provide address, phone, and select hub.");
      return;
    }

    setLoading(true);

    try {
      const bookingPayload = {
        bike: bike._id,
        pickupDate,
        returnDate,
        pickupSlot,   
        returnSlot,   
        paymentMethod,
        address,
        phone,
        hubId: hub,
      };

      if (paymentMethod === "offline") {
        // Offline booking
        const res = await axios.post("/api/bookings/create", {
          ...bookingPayload,
          paidAmount: 0,
        });

        if (res.data.success) {
          toast.success("Booking successful!");
          navigate("/my-bookings");
        } else {
          toast.error(res.data.message || "Booking failed!");
        }
      } else {
        // Online payment (Razorpay)
        const orderRes = await axios.post("/api/payment/create-order", {
          amount: payNow,
        });

        const orderData = orderRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Bike Booking",
          description: `Payment for ${bike.brand} ${bike.model}`,
          order_id: orderData.id,
          handler: async function () {
            const bookingRes = await axios.post("/api/bookings/create", {
              ...bookingPayload,
              paidAmount: payNow,
              paymentMethod: "online",
            });

            if (bookingRes.data.success) {
              toast.success("Booking successful!");
              navigate("/my-bookings");
            } else {
              toast.error(
                bookingRes.data.message || "Booking failed!"
              );
            }
          },
          prefill: {
            name: "User",
            email: "user@example.com",
            contact: phone || "9999999999",
          },
          theme: { color: "#3B82F6" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Payment failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bike) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Invalid booking session. Please book again.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Payment for {bike.brand} {bike.model}
      </h2>

      {/* Booking Summary */}
      <div className="mb-6 space-y-1 text-sm text-gray-600">
        <p>
          Pickup: {pickupDate} ({pickupSlot})
        </p>
        <p>
          Return: {returnDate} ({returnSlot})
        </p>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Total Amount:</p>
        <p className="text-xl font-semibold text-primary">
          {currency} {totalAmount}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
            className="w-full"
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
        className={`w-full py-3 rounded-full text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default Payment;
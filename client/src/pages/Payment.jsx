import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Payment = () => {
  const { axios, currency } = useAppContext();
  const navigate = useNavigate();
  const { state } = useLocation();

  // 🔹 Destructure pickupDate and returnDate from state
  const { bike, totalAmount, pickupDate, returnDate } = state;

  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [payNow, setPayNow] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates.");
      return;
    }

    setLoading(true);

    try {
      const paidAmount = paymentMethod === "offline" ? 0 : Number(payNow);

      const res = await axios.post("/api/bookings/create", {
        bike: bike._id,       // 🔹 send only bike ID
        pickupDate,
        returnDate,
        paidAmount,
        paymentMethod,
      });

      if (res.data.success) {
        toast.success("Booking successful!");
        navigate("/my-bookings");
      } else {
        toast.error(res.data.message || "Booking failed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Payment for {bike.brand} {bike.model}
      </h2>

      <p className="mb-2">
        Total Amount: {currency} {totalAmount}
      </p>

      <div className="my-4">
        <label className="block mb-1 font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>

      {paymentMethod === "online" && (
        <div className="my-4">
          <label className="block mb-2 font-medium">
            Pay Now: {currency} {payNow}
          </label>
          <input
            type="range"
            min="0"
            max={totalAmount}
            value={payNow}
            onChange={(e) => setPayNow(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 px-4 rounded text-white mt-4 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default Payment;

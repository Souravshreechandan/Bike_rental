import React from "react";

const PayButton = ({ amount }) => {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const res = await fetch("http://localhost:3000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // amount in INR
      });

      const orderData = await res.json();

      // 2️⃣ Options for Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID , // your Razorpay test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bike Booking",
        description: "Payment for Bike Rental",
        order_id: orderData.id,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // 3️⃣ Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error creating payment. Check console.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PayButton;

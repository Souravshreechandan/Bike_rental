import razorpay from "../configs/razorpay.js";

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 25) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Number(amount) * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

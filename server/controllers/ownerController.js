import imagekit from "../configs/imageKit.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import Hub from "../models/Hub.js";
import User from "../models/User.js";
import fs from "fs";

// ------------------- USER MANAGEMENT -------------------

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list Bikes" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------- BIKE MANAGEMENT -------------------

export const addBike = async (req, res) => {
  try {
    const { _id } = req.user;
    let bike = JSON.parse(req.body.bikeData);
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/bikes",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    const image = optimizedImageUrl;
    await Bike.create({ ...bike, owner: _id, image });

    res.json({ success: true, message: "Bike Added" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerBikes = async (req, res) => {
  try {
    const { _id } = req.user;
    const bikes = await Bike.find({ owner: _id });
    res.json({ success: true, bikes });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBikeAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bikeId } = req.body;
    const bike = await Bike.findById(bikeId);

    if (!bike || bike.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    bike.isAvailable = !bike.isAvailable;
    await bike.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bikeId } = req.body;
    const bike = await Bike.findById(bikeId);

    if (!bike || bike.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    bike.owner = null;
    bike.isAvailable = false;
    await bike.save();

    res.json({ success: true, message: "Bike Removed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- UPDATE BIKE -------------------

export const updateBike = async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { brand, model, pricePerDay, category, transmission, fuelType } = req.body;

    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ success: false, message: "Bike not found" });

    // Only owner can update
    if (bike.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update bike fields
    bike.brand = brand;
    bike.model = model;
    bike.pricePerDay = pricePerDay;
    bike.category = category;
    bike.transmission = transmission;
    bike.fuelType = fuelType;

    // Update image if provided
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/bikes",
      });

      const optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
      });

      bike.image = optimizedImageUrl;
    }

    await bike.save();
    res.json({ success: true, message: "Bike updated successfully", bike });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- DASHBOARD -------------------

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const bikes = await Bike.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("bike")
      .sort({ createdAt: -1 });
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedBookings = bookings.filter((b) => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce((acc, b) => acc + b.price, 0);

    res.json({
      success: true,
      dashboardData: {
        totalBikes: bikes.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: bookings.slice(0, 3),
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- USER IMAGE UPDATE -------------------

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- HUB MANAGEMENT -------------------

export const getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find().populate("owner", "name email");
    res.json({ success: true, hubs });
  } catch (err) {
    console.error("Error fetching all hubs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getHubById = async (req, res) => {
  try {
    const { hubId } = req.params;
    const hub = await Hub.findById(hubId).populate("owner", "name email");
    if (!hub) return res.status(404).json({ success: false, message: "Hub not found" });
    res.json({ success: true, hub });
  } catch (err) {
    console.error("Error fetching hub by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createHub = async (req, res) => {
  try {
    const ownerId = req.user?._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hub = new Hub({
      ...req.body,
      owner: ownerId,
    });

    await hub.save();
    res.json({ success: true, message: "Hub created successfully!", hub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const updates = req.body;
    const hub = await Hub.findByIdAndUpdate(hubId, updates, { new: true });
    if (!hub) return res.status(404).json({ success: false, message: "Hub not found" });

    res.json({ success: true, message: "Hub updated successfully!", hub });
  } catch (err) {
    console.error("Error updating hub:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const hub = await Hub.findByIdAndDelete(hubId);
    if (!hub) return res.status(404).json({ success: false, message: "Hub not found" });
    res.json({ success: true, message: "Hub deleted successfully" });
  } catch (err) {
    console.error("Error deleting hub:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

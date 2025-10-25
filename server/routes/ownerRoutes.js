import express from "express"
import { protect } from "../middleware/auth.js";
import { addBike, changeRoleToOwner, deleteBike, getDashboardData, getOwnerBikes, 
toggleBikeAvailability, updateUserImage, getAllUsers,toggleBlockUser, deleteUser,
updateHub,
getAllHubs,
getHubById,
deleteHub,
createHub,
updateBike} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// User/owner routes
ownerRouter.post("/change-role",protect,changeRoleToOwner)
ownerRouter.post("/add-bike", upload.single("image"),protect,addBike)
ownerRouter.get("/bikes",protect,getOwnerBikes)
ownerRouter.post("/toggle-bike",protect,toggleBikeAvailability)
ownerRouter.post("/delete-bike",protect,deleteBike)
ownerRouter.put("/bikes/:bikeId", protect, upload.single("image"), updateBike);


// Dashboard
ownerRouter.get('/dashboard', protect, getDashboardData)

// User management
ownerRouter.post('/update-image', upload.single("image"),protect,updateUserImage)
ownerRouter.get("/users", protect, getAllUsers);
ownerRouter.patch("/users/:userId/block", protect, toggleBlockUser);
ownerRouter.delete("/users/:userId", protect, deleteUser);

// Hub management (list all, get by id, delete)
ownerRouter.get("/hubs", protect, getAllHubs);
ownerRouter.get("/hubs/:hubId", protect, getHubById);
ownerRouter.post("/hubs", protect, createHub);
ownerRouter.put("/hubs/:hubId", protect, updateHub);
ownerRouter.delete("/hubs/:hubId", protect, deleteHub);

export default ownerRouter;
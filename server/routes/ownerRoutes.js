import express from "express"
import { protect } from "../middleware/auth.js";
import { addBike, changeRoleToOwner, deleteBike, getDashboardData, getOwnerBikes, 
toggleBikeAvailability, updateUserImage, getAllUsers, 
toggleBlockUser, deleteUser} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// User/owner routes
ownerRouter.post("/change-role",protect,changeRoleToOwner)
ownerRouter.post("/add-bike", upload.single("image"),protect,addBike)
ownerRouter.get("/bikes",protect,getOwnerBikes)
ownerRouter.post("/toggle-bike",protect,toggleBikeAvailability)
ownerRouter.post("/delete-bike",protect,deleteBike)

// Dashboard
ownerRouter.get('/dashboard', protect, getDashboardData)

// User management
ownerRouter.post('/update-image', upload.single("image"),protect,updateUserImage)
ownerRouter.get("/users", protect, getAllUsers);
ownerRouter.patch("/users/:userId/block", protect, toggleBlockUser);
ownerRouter.delete("/users/:userId", protect, deleteUser);


export default ownerRouter;
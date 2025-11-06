import express from "express";
import { protect } from "../middleware/auth.js";
import {getAllHubs,getHubById,updateHub,deleteHub,createHub,}
 from "../controllers/ownerController.js";

const hubRouter = express.Router();


hubRouter.get("/", protect, getAllHubs);
hubRouter.get("/:hubId", protect, getHubById);
hubRouter.put("/:hubId", protect, updateHub);
hubRouter.delete("/:hubId", protect, deleteHub);
hubRouter.post("/", protect, createHub);


export default hubRouter;

import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import {getUserProfile , followUser , getSuggested , updateUserProfile} from "../Controllers/user.controllers.js"
const router = express.Router();

router.get("/profile/:username" , protectRoute , getUserProfile)
router.get("/suggested" , protectRoute , getSuggested)
router.get("/follow/:id" , protectRoute , followUser)
router.get("/update" , protectRoute , updateUserProfile)
router.get("/getLiked/:id")


export default router
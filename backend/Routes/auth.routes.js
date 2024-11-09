import express from "express";
import { signup , login , logout , getMe } from "../Controllers/auth.controllers.js";
import { protectRoute } from "../Middleware/protectRoute.js";
const router = express.Router();

router.post("/signup" , signup)
router.post("/login" , login)
router.post("/logout" , logout)
router.get("/getMe", protectRoute , getMe)

export default router
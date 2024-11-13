import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import {getNotifications ,deleteNotification  , clearNotifications} from "../Controllers/notification.controllers.js"
const router = express.Router();

router.get("/" , protectRoute , getNotifications)
router.delete("/" , protectRoute , clearNotifications)
router.delete("/:id" , protectRoute , deleteNotification)

export default router;


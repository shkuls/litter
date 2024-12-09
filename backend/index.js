import express from "express";
import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.routes.js"
import postRoutes from "./Routes/post.routes.js"
import notificationRoutes from "./Routes/notification.routes.js"
import { v2 as cloudinary} from "cloudinary";
import connectDB from "./DB/index.js";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
import cors from 'cors'

dotenv.config({path : "../.env"});


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const app = express()
app.use(cors({
    origin: "http://localhost:3000", // Replace with your client URL
    credentials: true // Allows cookies to be sent
  }));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post" , postRoutes)
app.use("/api/notification" , notificationRoutes)

app.listen(8000 , ()=>{
    console.log("Server running on port 8000")
    connectDB();
})
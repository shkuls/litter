import express from "express";
import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.routes.js"
import postRoutes from "./Routes/post.routes.js"
import { v2 as cloudinary} from "cloudinary";
import connectDB from "./DB/index.js";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
dotenv.config({path : "../.env"});

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post" , postRoutes)

app.listen(8000 , ()=>{
    console.log("Server running on port 8000")
    connectDB();
})
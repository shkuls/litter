import express from "express";
import authRoutes from "./Routes/auth.routes.js"
import connectDB from "./DB/index.js";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
dotenv.config({path : "../.env"});
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth" , authRoutes)

app.listen(8000 , ()=>{
    console.log("Server running on port 8000")
    connectDB();
})
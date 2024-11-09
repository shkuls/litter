import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path: '../../env'});
const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI )
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

export default connectDB
import User from "../Models/user.model.js";
import jwt from 'jsonwebtoken'
export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
       if(!token){
        return res.status(400).json({error : "Unauthorized access : No token provided"})

       }
       const decoded = jwt.verify(token , process.env.JWT_SECRET)
       if(!decoded)
       {
        return res.status(400).json({error : "Unauthorized access : Invalid token "})
       }
       else{
        const username = decoded.username;

        const currentUser = await User.findOne({username}).select("-password")
       
        if(!currentUser){
            return res.status(400).json({error : "User not found"})
        }
        else{
            req.user = currentUser;
            next();
        }
       }
    } catch (error) {
        return res.send(error)
        // return res.status(500).json({error : "Internal Server Error in protectRoute Middleware"})
    }
}
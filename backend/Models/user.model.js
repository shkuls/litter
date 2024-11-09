import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
    username:{
        type : String , 
        required : true , 
        unique : true
    } , 
    fullName : {
        type : String , 
        required : true , 
    
    },
    email:{
        type : String , 
        required : true , 
        unique : true
    },
    password : {
        type : String , 
        required : true , 
        
    },
    followers : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
      
    },
    following : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User" ,
        
    },
    profileImg:{
        type : String ,
         default : ""
    },
    coverImg:{
        type : String ,
         default : ""
    },
    bio:{
        type : String ,
         default : ""
    },
    link:{
        type : String ,
         default : ""
    }
} , {timestamps: true})

const User = mongoose.model("User" , UserSchema)

export default User;

import User from '../Models/user.model.js'
import bcrpyt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as EmailValidator from 'email-validator';


export const signup = async (req, res) => {
    const { fullName, username, email, password } = req.body;
    if(password.length < 6)
    {console.log("Password should have atleast 6 characters")
        return res.status(400).send({ error: "Password should have atleast 6 characters" })
    }
    if (!EmailValidator.validate(email)) {
        return res.status(400).send({ error: "Invalid Email format" })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
        return res.status(400).send({ error: "Email ID already exists" })
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) { 
        
        return res.status(400).send({ error: "Username already taken"  , existingUsername}) }


    const salt = await bcrpyt.genSalt(10);
    const hash = await bcrpyt.hash(password, salt)
    const newUser = new User({
        username,
        fullName,
        email,
        password: hash
    })

    if (newUser) {
        await newUser.save();
        const id = newUser._id
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '15d'
        })
        console.log(token)
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 100,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"

        })
        return res.status(200).send({
            _id: newUser._id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,

        })
    }
}
export const login = async (req, res) => {
    const {username , password} = req.body;
    const currentUser = await User.findOne({username})
    if(currentUser){
        const currentUserId = currentUser._id;
        const isPasswordValid = await bcrpyt.compare(password , currentUser?.password || "")
        if(isPasswordValid)
        {
            const token = jwt.sign({ currentUserId }, process.env.JWT_SECRET, {
                expiresIn: '15d'
            })
            console.log(token)
            console.log("hi")
            res.cookie("jwt", token, {
                maxAge: 15 * 24 * 60 * 60 * 100,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development" , 
               
    
            })
            return res.status(200).send({
                _id: currentUser._id,
                username: currentUser.username,
                fullName: currentUser.fullName,
                email: currentUser.email,
                followers: currentUser.followers,
                following: currentUser.following,
                profileImg: currentUser.profileImg,
                coverImg: currentUser.coverImg,
    
            })
        }
        else{
            return res.status(400).send({error  : "Invalid Password"})
        }
    }
    else{
        return res.status(400).send({error : "User not found"})
    }
}
export const logout = async (req, res) => {
    try {
        
        res.cookie("jwt" , "")
        res.status(200).send({data : "User Logged out"})
    } catch (error) {
        console.log("Error in logout controller")
        res.status(500).send({error : "Internal server error"})
    }
}

export const getMe = async (req ,res )=>{
    res.status(200).send(req.user)
}
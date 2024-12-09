import User from "../Models/user.model.js";
import Notification from "../Models/notification.model.js"
import * as EmailValidator from 'email-validator';

import { v2 as cloudinary } from "cloudinary"
import bcrypt from "bcryptjs/dist/bcrypt.js";
export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password")
        if (!user)
            return res.status(400).send({ message: "User not found" })
        else {
            return res.status(200).json(user)
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" })
    }
}

export const followUser = async (req, res) => {
    try {

        const { id } = req.params;
        let userID = id;
        console.log(userID)
        const currentUser = req.user
        const otherUser = await User.findById(userID)

        if (otherUser?.username === currentUser.username) {
            return res.status(400).send({ message: "You cannot follow/unfollow yourself" })

        }
        if (!currentUser || !otherUser) {
            return res.status(400).send({ message: "User not found" })
        }
        const isFollowing = currentUser.following.includes(userID)
        if (isFollowing) {
            //unfollow
            await User.findByIdAndUpdate(otherUser._id, { $pull: { followers: currentUser._id } })
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: otherUser._id } })
            const notif = new Notification({
                from: currentUser._id,
                to: otherUser._id,
                type: "follow",

            })
            await notif.save();
            res.status(200).send({ message: "User unfollowed success" })

        }
        else {
            //follow
            await User.findByIdAndUpdate(otherUser._id, { $push: { followers: currentUser._id } })
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: otherUser._id } })
            res.status(200).send({ message: "User followed success" })

        }


    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error" })
    }
}

export const getSuggested = async (req, res) => {
    try {

        const currentUser = req.user;
        const UsersFollowed = await User.findById(currentUser._id).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: currentUser._id }
                },


            },
            { $sample: { size: 10 } }
        ])

        const filteredUsers = users.filter(user => !UsersFollowed.following.includes(user))
        const suggestedUsers = filteredUsers.slice(0, 5)
        suggestedUsers.map((user) => {
            user.password = null
        })
        res.status(200).send(suggestedUsers)
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Error at suggested Users controller" })

    }


}


export const updateUserProfile = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    const { profileImg, coverImg } = req.body
    const userID = req.user._id;

    try {
        let user = await User.findById(userID);

        if (!user) { return res.status(400).send({ error: "Error at Update Users controller" }) }
        if (fullName) {
            user.fullName = fullName;
        }
        if (bio) {
            user.bio = bio;
        }
        if (link) {
            user.link = link;
        }
        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).send({ error: "Please enter both current and new passwords." })
        }
        if (currentPassword && newPassword) {
            if (currentPassword === newPassword) {
                return res.status(400).send({ error: "Current and new password cannot be the same." })
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (isMatch) {
                if (newPassword.length < 6) {
                    return res.status(400).send({ error: "Password should have atleast 6 characters" })
                }
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt)
            }
            else {
                return res.status(400).send({ error: "Please enter the correct current password" })
            }
        }

            if (profileImg) {
                if (user.profileImg) {
                    await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
                }
                const uploadedResponse = await cloudinary.uploader.upload(profileImg)
                user.profileImg = uploadedResponse.secure_url;
            }
            if (coverImg) {
                if (user.coverImg) {
                    await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
                }
                const uploadedResponse = await cloudinary.uploader.upload(coverImg)
                user.profileImg = uploadedResponse.secure_url;
            }
            if(email)
            {

                if (!EmailValidator.validate(email)) {
                    return res.status(400).send({ error: "Invalid Email format" })
                }
                const existingEmail = await User.findOne({ email })
                if (existingEmail) {
                    return res.status(400).send({ error: "Email ID already exists" })
                }
            }
            const existingUsername = await User.findOne({ username })
            if (existingUsername) {

                return res.status(400).send({ error: "Username already taken", existingUsername })
            }
            user = await user.save();
            user.password = null;


            
            return res.status(200).send({ message: "User Updated Successfully" })


    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Error at Update Users controller" })
    }
}



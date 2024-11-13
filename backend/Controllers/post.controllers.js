import Post from "../Models/post.model.js";
import User from "../Models/user.model.js";
import Notification from "../Models/notification.model.js";
import {v2 as cloudinary} from "cloudinary"
export const createPost = async(req , res)=>{
    try {
        
        const text = req.body?.text;
        let img  = req.body?.img;
        const user = req.user;

        if(!text && !img ){
            return res.status(400).send({ error : "Post must have either text or image"})
        }
        if(img){
            const uploadedResponse =await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }
        const newPost = new Post({
            user : user._id,
            text,
            img
        })
        await newPost.save()
        res.status(200).send({ msg: "Post Created Succesfully"  , newPost})
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at Post creation controller"})
    }
    
}
export const likeUnlikePost = async(req , res)=>{
try { 
        const currentUser = req.user;
        const id = req.params.id;
        const postLikes  = await Post.findById(id).select("likes");
        if(!postLikes){
            return res.status(400).send({error : "Post not found"})

        }
        if(postLikes.likes.includes(currentUser._id))
        {
            //unlike the post
            await Post.findByIdAndUpdate(id,  {$pull : {likes : currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id , {$pull : {likedPosts : id}})
            res.status(200).send({ msg: "Post unliked Succesfully" })
        }
        else{
            //like the post
            await Post.findByIdAndUpdate(id,  {$push : {likes : currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id , {$push : {likedPosts : id}})
            const postUser = await Post.findById(id).select("user");
            const notif = new Notification({
                from: currentUser._id,
                to: postUser,
                type :"like",
                
            })
            await notif.save();
            res.status(200).send({ msg: "Post liked Succesfully" })

        }


} catch (error) {
    console.log(error)
        res.status(500).send({error : "Error at Post Like controller"})
}
}
export const deletePost = async(req , res)=>{
try {
    const post  = await Post.findById(req.params.id)
    if(!post){
        return res.status(400).send({error : "No post found"})

    }
    if(post.user.toString !== req.user._id.toString){
        return res.status(400).send({error : "You are not allowed to delete this post"})

    }
    if(post.img){
        await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);


    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Post Deleted Succesfully" })
} catch (error) {
    console.log(error)
        res.status(500).send({error : "Error at Delete controller"})
}
}
export const createComment = async(req , res)=>{
        try {
            const {text} = req.body;
            const userID = req.user._id;
            const postID = req.params.id;
            if(!text)
            {
                return res.status(400).send({error : "Text is required for comment"})

            }
            const post  = await Post.findById(postID)
            if(!post){
                return res.status(400).send({error : "Post not found"})

            }
            const comment = {user:  userID , text }
            post.comments.push(comment)
            await post.save()
            const notif = new Notification({
                from: userID,
                to: post.user,
                type :"comment",
                
            })
            await notif.save();
            res.status(200).send({msg : "Comment added successfully"})
            

        } catch (error) {
            console.log(error)
        res.status(500).send({error : "Error at createComment controller"})
        }
}   

export const getAllPosts = async(req,res)=>{
    try {
        const id = req.params.id || null;
        const posts = await Post.find().sort({createdAt : -1}).populate({
            path : "user",
            select:'-password'
        })
        .populate({
            path: "comments.user",
            select: "-password",
        })
        if(posts.length === 0){
            return res.status(200).json([])
        }
        res.status(200).send(posts)

    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at createComment controller"})
        }
}

export const getLikedPosts = async (req,res) =>{
    try {
        const id = req.params.id;
        const posts = await User.findById(id).populate({
            path:"likedPosts"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at getLikedPosts controller"})
    }
}


export const getFollowedPosts = async(req ,res) =>{
    try {
        const currentUser = req.user;
        if(!user){
            return res.status(400).send({error : "User not found"})

        }
        const following = await User.findById(currentUser._id).select("following")
        const feedPosts = await Post.find({user : {$in : following}}).sort({createdAt : -1}).populate({
            path:"user",
            select :"-password"
        })
        res.status(200).send(feedPosts)
    } catch (error) 
        {
            console.log(error)
            res.status(500).send({error : "Error at getFollowed posts controller"})
        }
    
}


export const getUserPosts = async(req,res)=>{
    try {
        const userId = req.params.id;
        const userPosts = await Post.find({user : userId}).sort({createdAt : -1}).populate({
            path : "user", 
            select: "-password"
        }).populate({
            path:"comments.user",
            select : "-password"
        })
        res.status(200).send(userPosts)
    } catch (error){
        console.log(error)
        res.status(500).send({error : "Error at getUserPosts controller"})
    }
}
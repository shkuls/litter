import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { createPost , likeUnlikePost , deletePost , createComment , getAllPosts , getFollowedPosts , getUserPosts} from "../Controllers/post.controllers.js"
const router = express.Router();

router.post("/create" , protectRoute ,  createPost)
router.post("/like/:id" , protectRoute ,  likeUnlikePost)
router.post("/comment/:id" , protectRoute ,  createComment)
router.delete("/:id" , protectRoute ,  deletePost)
router.post("/followedPosts" , protectRoute , getFollowedPosts)
router.get("/all" , protectRoute , getAllPosts)
router.get("/getUserPosts/:id" , protectRoute , getUserPosts)
export default router
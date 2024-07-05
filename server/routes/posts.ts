import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts";
import { verifyToken } from "../middleware/auth";


const postRoutes = express.Router();

// Read
// This is just going to get all the feedposts and not curate anything (i can make this just show friend posts)
// realworld social media uses machine learning and AI to do this stuff.
// maybe we can fuck around and find out.
postRoutes.get("/", verifyToken, getFeedPosts);
// current users posts
postRoutes.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
postRoutes.patch("/:id/like", verifyToken, likePost);

export default postRoutes;
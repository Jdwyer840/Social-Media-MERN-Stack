import mongoose from "mongoose";
import Post, {IPostModel, IPostDocument} from "../models/Post";
import User from "../models/User";

import {Request, Response} from 'express';
import {IUserDocument} from "../models/User";

interface INewPostRequestBody {
    userId: string;
    description: string,
    picturePath: string
}

// CREATE
export const createPost = async (req: Request, res: Response) => {
    console.log("in posts")
    console.log(req.body)
    try {
        const {userId, description, picturePath} = req.body as INewPostRequestBody;
        if (!userId) {
            res.status(500).json({error: "You don messed up A-A-ron. No userId for creating a new post..."})
            return
        }

        const user: IUserDocument | null = await User.findById(userId);
        if (user) {
            // this sort of goes against typescripts functionality
            // but i was having troubles getting the two to work since post extends Document
            // and typescript will complain if we are not accounting for document's properties in the object below...
            // something to figure out in the future.
            const newPost = new Post({
                userId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                description: description,
                userPicturePath: user.picturePath,
                picturePath: picturePath,
                likes: new Map<string, boolean>(),
                comments: []
            }) as IPostDocument;
            await newPost.save();
        }


        // This grabs all the post. gives updated list of posts to the frontend with the new post
        // always consider how what we send back affects the frontend
        const post = await Post.find().sort({createdAt: -1});;
        // 201 represents we created somthing
        res.status(201).json(post)
    } catch (err: any) {
        res.status(409).json({ message: err.message});
    }
}

// READ
export const getFeedPosts = async (req: Request, res: Response) => {
    try {
         // this will grab all the posts regardless of friends i think.
         // another thing to do for fun.
        const post = await Post.find().sort({createdAt: -1});;
        res.status(200).json(post);
    } catch (err: any) {
        res.status(404).json({ message: err.message});
    }
}

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err: any) {
        res.status(404).json({ message: err.message});
    }
}
//UPDATE
export const likePost = async (req: Request, res: Response) => {
    // Handles both liking and unliking post
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post: IPostDocument | null = await Post.findById(id);
        if (!post) {
            res.status(404).json({error: "posts not found"})
            return
        }

        const isLiked = post.likes.get(userId);

        if (isLiked) {
            console.log("is liked11111")
            post.likes.delete(userId);
            console.log("post likes")
            console.log(post.likes)
        } else {
            console.log("is not liked11111")
            post.likes.set(userId, true);
            console.log("post likes")
            console.log(post.likes)
        }
        // update existing post, by updating likes. idk what the new is about.
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes},
            {new: true}
        ).sort({createdAt: -1});

        if (!updatedPost) {
            throw new Error("Something went wrong. could not find and update post in posts controller.")
        }

        res.status(200).json(updatedPost);
    } catch (err: any) {
        res.status(404).json({ message: err.message});
    }
}

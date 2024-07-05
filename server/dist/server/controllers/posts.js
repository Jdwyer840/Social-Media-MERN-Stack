import Post from "../models/Post.js";
import User from "../models/User.js";
// CREATE
export const createPost = async (req, res) => {
    console.log("in posts");
    console.log(req.body);
    try {
        const { userId, description, picturePath } = req.body;
        if (!userId) {
            res.status(500).json({ error: "You don messed up A-A-ron. No userId for creating a new post..." });
            return;
        }
        const user = await User.findById(userId);
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
                likes: new Map(),
                comments: []
            });
            await newPost.save();
        }
        // This grabs all the post. gives updated list of posts to the frontend with the new post
        // always consider how what we send back affects the frontend
        const post = await Post.find();
        // 201 represents we created somthing
        res.status(201).json(post);
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
};
// READ
export const getFeedPosts = async (req, res) => {
    try {
        // this will grab all the posts regardless of friends i think.
        // another thing to do for fun.
        const post = await Post.find();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
//UPDATE
export const likePost = async (req, res) => {
    // Handles both liking and unliking post
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ error: "posts not found" });
            return;
        }
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }
        // update existing post, by updating likes. idk what the new is about.
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        if (!updatedPost) {
            throw new Error("Something went wrong. could not find and update post in posts controller.");
        }
        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

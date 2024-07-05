import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: {
        type: Map, // Check if user id exists in map and true if so. liking adds to the map
        of: Boolean //map is much more efficient than an array in this case apparently. like if we have 20000 likes we have to iterate until we find an id we are looking for
    },
    // comments could be their own model
    // have it's own likes or replies
    comments: {
        type: [String], // or [commentSchema] if using a subdocument
        default: []
    },
    location: String
}, {
    timestamps: true
});
const Post = mongoose.model("Post", PostSchema);
export default Post;

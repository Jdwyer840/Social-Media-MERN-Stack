import mongoose, {Document, Types} from "mongoose";
import {IPost} from "../shared/types/models";

export interface IPostDocument extends IPost, Document {
    // userId: string; //mongoose.Types.ObjectId | there is some typescript trickyness here i couldnt resolve..
    // firstName: string;
    // lastName: string;
    // description?: string;
    // userPicturePath?: string;
    // picturePath?: string;
    // likes: Map<string, boolean>; // this may need to be user id instead of string
    // comments?: any[]; // Replace with a more specific type if possible
    // location?: string;
}

export interface IPostModel extends mongoose.Model<IPostDocument> {
}

const PostSchema = new mongoose.Schema<IPostDocument, IPostModel>(
    {
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
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

export default Post;

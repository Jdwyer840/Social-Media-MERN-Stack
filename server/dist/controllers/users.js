import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import mongoose from 'mongoose';
// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('friends');
        if (!user) {
            throw new Error(`User not found! id given was: ${id}`);
        }
        // we populate friends here so we get the full documents.
        await user.populate('friends');
        // const friends = user.friends;// as IUser[]; // Type assertion here
        const friends = user.friends;
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
// POST
export const makeFriendRequest = async (req, res) => {
    console.log("making a friend request");
    try {
        // i assume that the req will include the id of the user making the request
        // and the friend. gona do some hole filling approach as a wise dev recommended
        const { userId, friendId } = req.body;
        console.log("req bdy");
        console.log(req.body);
        // Check if a friend request was already made and create a new friend request
        console.log("making friend request");
        await FriendRequest.createFriendRequest(userId, friendId);
        console.log("friend request made");
        console.log("friend request in users controller should have been a success!");
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        const { idParam, friendIdParam } = req.params; // interface doesnt wana work here
        if (!idParam || !friendIdParam) {
            throw new Error("Incomplete request passed to addRmoveFriend controller");
        }
        // lets make iuser allow string array [ids] and user array
        // Convert strings to mongoose object ids
        let id = new mongoose.Types.ObjectId(idParam);
        let friendId = new mongoose.Types.ObjectId(idParam);
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const friend = await User.findById(friendId).populate("friends");
        const friendIndex = user.friends.findIndex(friendObjectId => friendObjectId.toString() === friendId.toString());
        if (friendIndex > -1) {
            // Remove friend
            user.friends.splice(friendIndex, 1);
            const friendIndexInFriend = friend.friends.findIndex(friendObjectId => friendObjectId.toString() === friendId.toString());
            if (friendIndexInFriend > -1) {
                console.log("wtf1");
                friend.friends.splice(friendIndexInFriend, 1);
            }
        }
        else {
            console.log("wtf2");
            // Add friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();
        // await user.populate('friends').exec();
        await user.populate('friends');
        // overriding typescript here. mongoose be a bitch to work with
        const friends = user.friends;
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
};

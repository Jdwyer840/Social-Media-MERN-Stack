import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    makeFriendRequest

} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();
console.log("here?")

// READ
// query string for id
userRoutes.get("/:id", verifyToken, getUser);
userRoutes.get("/:id/friends", verifyToken, getUserFriends);

// update 
userRoutes.patch("/:id/:friendId", verifyToken, addRemoveFriend);
userRoutes.post("/request", verifyToken, makeFriendRequest);

export default userRoutes;
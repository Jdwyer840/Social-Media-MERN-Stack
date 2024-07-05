import mongoose, { Document } from "mongoose";
import User from "./User.js"

import { Types } from "mongoose";


type FriendRequestStatus = 'open' | 'denied' | 'accepted'

interface IFriendRequestDocument extends Document {
  requestedFromUser: Types.ObjectId;
  requestedToUser: Types.ObjectId;
  status: FriendRequestStatus;

}

interface IFriendRequestModel extends mongoose.Model<IFriendRequestDocument> {
    findByUser(userId: Types.ObjectId): Promise<IFriendRequestDocument[]>;
    isActiveFriendRequest(requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId): Promise<boolean>;
    isFriendRequestOpen(requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId): Promise<boolean>;
    createFriendRequest(requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId): Promise<boolean>;
    // ... other static method declarations
}

const FriendRequestSchema = new mongoose.Schema<IFriendRequestDocument, IFriendRequestModel>( // <document interface, model interface>
  {
    requestedFromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'denied', 'accepted'],
      default: 'open' // Optional: you can set a default value
    }
  },
  {
    timestamps: true  // This adds createdAt and updatedAt fields automatically
  });

FriendRequestSchema.statics.findByUser = function  (userId: Types.ObjectId): Promise<IFriendRequestDocument[]> {
  return this.find({
    $or: [
      { requestedFromUser: userId },
      { requestedToUser: userId }
    ]
  });
};

FriendRequestSchema.statics.isActiveFriendRequest = function (requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId) {


}

FriendRequestSchema.statics.isFriendRequestOpen = async function (requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId): Promise<boolean> {
  const existing = await this.findOne({
    requestedFromUser: requestFromUserId,
    requestedToUser: requestToUserId,
    status: "open"
  });


  return existing !== null
}

FriendRequestSchema.statics.createFriendRequest = async function (requestFromUserId: Types.ObjectId, requestToUserId: Types.ObjectId) {
  try {
    console.log("in friend request model");
    console.log("checking if users are already frieds");
    // Check if users are already friends
    const areAlreadyFriends = await User.isUserFriendsWithUser(requestFromUserId, requestToUserId);
    if (areAlreadyFriends) {
      throw new Error('Users are already friends.');
    }

    console.log("friend request made?");

    // broken
    let isFriendRequestOpen = await this.isFriendRequestOpen(requestFromUserId, requestToUserId)
    if (isFriendRequestOpen) {
      throw new Error('Friend request already sent.');
    }

    // Create a new friend request since they are not friends and no pending request exists
    const newFriendRequest = new this({
      requestedFromUser: requestFromUserId,
      requestedToUser: requestToUserId,
      status: 'open'
    });
    console.log("about to save a friend");
    await newFriendRequest.save();
    return newFriendRequest;
  } catch (error) {
    console.error('Error creating friend request:', error);
    // Depending on how you want to handle errors, you might throw the error,
    // return null, or handle it in some other way
    throw error;
  }
}

FriendRequestSchema.virtual('isPending').get(function () {
  // property pretty much
  return this.status === 'open';
});


const FriendRequest = mongoose.model<IFriendRequestDocument, IFriendRequestModel>("FriendRequest", FriendRequestSchema);

export default FriendRequest;

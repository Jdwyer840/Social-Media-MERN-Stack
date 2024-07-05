import mongoose, {Document, Model, Types} from 'mongoose';
import FriendRequest from "./FriendRequest";

import Notification from "./Notification";
import {IUser} from "../shared/types/models";
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// THIS HERE COULD BE PRETTY COOL TO TRY OUT... USES TYPE SCRIPT CLASSES
// AND THEN IT BUILD MONGOOSE MODELS FROM THE TYPE SCRIPT CLASSES.
// import { getModelForClass, prop } from '@typegoose/typegoose';

// class User {
//   @prop({ required: true })
//   public name!: string;

//   // other properties...
// }

// const UserModel = getModelForClass(User);
export interface IUserDocument extends Omit<IUser, 'friends'>, Document {
    // save(): Promise<this>;
    friends: Types.ObjectId[];
    _id: Types.ObjectId;
    // firstName: string;
    // lastName: string;
    // email: string;
    // password?: string; // Optional since it depends on the isNew condition
    // picturePath?: string;
    // friends: Types.ObjectId[] | IUserDocument[];
    // notifications?: Types.ObjectId[];
    // friendRequests?: Types.ObjectId[];// no need for '?'s as Mongoose will initialize them as empty arrays due to the default: [] in below schema.
    // location?: string;
    // occupation?: string;
    // viewedProfile?: number;
    // impressions?: number;
    //
    //  createdAt?: Date | number;
    // updatedAt?: Date | number;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
    isUserFriendsWithUser(userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean>;
}


const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: function (): boolean {
                // This will only require a password when the document is new (being created)
                return this.isNew; // sNew is a 'Document' property
            },
            min: 5,
        },
        picturePath: {
            type: String,
            default: ""
        },
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        notifications: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
            default: []
        }],
        // these are friend requests going to the current user.
        friendRequests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FriendRequest',
            default: []
        }],
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number
    },

    {
        timestamps: true
    }
);

UserSchema.statics.isUserFriendsWithUser = async function (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
    try {
        let user = await this.findById(userId).exec() as IUserDocument;
        if (!user) throw new Error("user does not exist");

        // Assuming 'friends' is an array of Types.ObjectId
        return user.friends.some((friendObjectId) => friendObjectId.toString() === friendId.toString());
    } catch (error) {
        console.error('Error in isUserFriendsWithUser:', error);
        throw error;
    }
}

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;

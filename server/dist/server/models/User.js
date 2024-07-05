import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
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
        required: function () {
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
}, {
    timestamps: true
});
UserSchema.statics.isUserFriendsWithUser = async function (userId, friendId) {
    try {
        let user = await this.findById(userId).exec();
        if (!user)
            throw new Error("user does not exist");
        // Assuming 'friends' is an array of Types.ObjectId
        return user.friends.some((friendObjectId) => friendObjectId.toString() === friendId.toString());
    }
    catch (error) {
        console.error('Error in isUserFriendsWithUser:', error);
        throw error;
    }
};
const User = mongoose.model('User', UserSchema);
export default User;

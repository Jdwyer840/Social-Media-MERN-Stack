import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
    // also why not add some stuff and remove it later if we dont need it. this makes
    // sense for the user to be in here, so why not?
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notificationType: { type: String, enum: ['message', 'friend_request'] },
    content: String,
    read: { type: Boolean, default: false },
}, {
    timestamps: true
});
const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;

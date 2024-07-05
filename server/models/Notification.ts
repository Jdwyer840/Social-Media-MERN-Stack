import mongoose, {Document} from "mongoose";

// trying out having the document stored in the user... woop woop.s
// not sure if it is better to have the ids stored in user
// or just actually have the user id stored here...

// might actually make mroe sense to have the user id stored in this here notificaiton but cross that bridge later...
//----------------
// ok we are actually going to add a user reference here and user schema will have an array of ids reppin this model
// same for friend request. 
type NotificationType = 'message' | 'friend_request';

interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    notificationType: NotificationType;
    content: String;
    read: boolean;
}



const NotificationSchema = new mongoose.Schema<INotification>(
    {
        // also why not add some stuff and remove it later if we dont need it. this makes
        // sense for the user to be in here, so why not?
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notificationType: { type: String, enum: ['message', 'friend_request'] },
        content: String,
        read: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
)

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
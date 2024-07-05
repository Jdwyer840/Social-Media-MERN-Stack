export interface IUser {
    _id: any;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Optional since it depends on the isNew condition
    picturePath?: string;
    friends: string[] | IUser[];
    notifications?: string[];
    friendRequests?: string[];// no need for '?'s as Mongoose will initialize them as empty arrays due to the default: [] in below schema.
    location?: string;
    occupation?: string;
    viewedProfile?: number;
    impressions?: number;

    createdAt?: Date | number;
    updatedAt?: Date | number;
}

export interface IPost {
    postId: string;
    userId: string; //mongoose.Types.ObjectId | there is some typescript trickyness here i couldnt resolve..
    firstName: string;
    lastName: string;
    description?: string;
    userPicturePath?: string;
    picturePath?: string;
    likes: Map<string, boolean>; // this may need to be user id instead of string
    comments: any[]; // Replace with a more specific type if possible
    location?: string;
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

import {Request, Response} from "express";
import mongoose from "mongoose";
// import {IUserDocument} from "../models/IUserDocument";
import {IUser} from "../shared/types/models";
import {sendErrorResponse} from "../shared/utils/api";
import {ErrorType} from "../shared/types/errors";
import {IApiResponse} from "../shared/types/api";

/* REGISTER USER */
interface RegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    picturePath?: string;
    friends?: string[] | IUser[];
    location?: string;
    occupation?: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}


export const register = async(req: Request, res: Response) => { // req = Request from front end. res = Response from here to frontend
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body as RegisterRequestBody;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            // Following are dummy values as this tutorial is big and we simplify things.
            // Maybe I can add this in for shits and giggles later on...
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // frontend will work with the same structured object
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err: any) {
        console.log(`Something went wrong creating user ${err.message}`);
        res.status(500).json({error: err.message});
    }
};

//LOGGING IN
//Note this approach is generally hackable, but this is a demo
// look into ways to make this better.

// interface IApiResponse {
//     status: string,
//     message: string,
//     error?: string
// }

interface IAuthResponseBody {
    user: IUser,
    token: string
}

const sendAuthSuccessResponse = (res: Response, status: number, body?: IAuthResponseBody) => {
    const response: IApiResponse = {
        message: "Success",
        success: true,
        body: body as IAuthResponseBody
    }
    return res.status(status).json(response);
}

export const login = async (req: Request, res: Response) => {
    console.log("wtf in login controller")
    try {

        const {email, password} = req.body;
        const user: IUser | null = await User.findOne({email: email});
        // const user = await User.findOne({email: email});

        if (!user) return sendErrorResponse(res, ErrorType.UserNotFound, 400)//res.status(400).json({mesg: "User does not exist."});


        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return res.status(400).json({mesg: "Invalid credentials."});
        console.log("herheerhr")

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT has no Secrets");
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        console.log(token)
        delete user.password;
        return sendAuthSuccessResponse(res, 200, { token, user})
        // return res.status(200).json();

    } catch (err: any) {
        console.log(`Something went wrong logging in ${err.message}`);
        res.status(500).json({error: err.message});
    }
}

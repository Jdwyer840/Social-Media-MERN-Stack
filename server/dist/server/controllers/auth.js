import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
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
    }
    catch (err) {
        console.log(`Something went wrong creating user ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};
//LOGGING IN
//Note this approach is generally hackable, but this is a demo
// look into ways to make this better.
export const login = async (req, res) => {
    console.log("wtf in login controller");
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        // const user = await User.findOne({email: email});
        if (!user)
            return res.status(400).json({ mesg: "User does not exist." });
        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch)
            return res.status(400).json({ mesg: "Invalid credentials." });
        console.log("herheerhr");
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT has no Secrets");
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        console.log(token);
        delete user.password;
        res.status(200).json({ token, user });
    }
    catch (err) {
        console.log(`Something went wrong logging in ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Define an interface to extend the Request object with the user property
interface RequestWithUser extends Request {
    user?: any; // You can define a more specific type for the user
}

export const verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || "");
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

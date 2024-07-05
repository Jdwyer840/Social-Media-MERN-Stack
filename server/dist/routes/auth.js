import express from "express";
import { login } from "../controllers/auth.js";
const authRoutes = express.Router();
// This will be prefixed with "auth" because index js specifies this
authRoutes.post("/login", login);
export default authRoutes;

// Import required packages/modules
import express from "express"; // Framework for building web applications
import bodyParser from "body-parser"; // Middleware for parsing JSON and URL-encoded data
import mongoose from "mongoose"; // MongoDB ODM for interacting with the database
import cors from "cors"; // Middleware for handling Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Package for managing environment variables
import multer from "multer"; // Middleware for handling file uploads
import helmet from "helmet"; // Middleware for enhancing application security
import morgan from "morgan"; // Middleware for logging HTTP requests
import path from "path"; // Module for working with file paths
import { fileURLToPath } from "url"; // Module for converting file URLs to paths
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
// import {users, posts} from "./data/index.js";
console.log("here");
/* CONFIGURATIONS */
// Set up configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from a .env file
dotenv.config();
console.log("MongoDB URL:", process.env.MONGO_URL);
// THE URL VALUE IS GETTING LOST SOME HOW SO I AM STORING IT WHERE IT IS ACCESSABLE
// Create an Express application
const app = express();
// Enable parsing JSON data in requests
app.use(express.json());
// Enhance security by setting various HTTP headers
//app.use(helmet());
// Configure Cross-Origin Resource Sharing (CORS) policy
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Set up request logging using the "common" format
app.use(morgan("common"));
// Configure body parsing for JSON and URL-encoded data with size limits
app.use(bodyParser.json({ limit: "30mb" })); // , extended: true ypescript says this is not a thing
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// Enable CORS for handling requests from different origins
app.use(cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Ensure PATCH is included
    credentials: true // Important if you are using sessions or basic auth
}));
// Serve static files (images) from the "public/assets" directory
app.use("/assets", express.static(path.join(__dirname, '../public/assets')));
console.log("working directory");
console.log(path.join(__dirname, 'public/assets'));
// Set up file storage settings using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("WTF");
        console.log(req.url);
        cb(null, "public/assets"); // Define the directory to store uploaded files
    },
    filename: function (req, file, cb) {
        console.log("file");
        console.log(file.originalname);
        cb(null, file.originalname); // Define the file name for uploaded files
    }
});
const upload = multer({ storage });
// ROUTES WITH FILES
// Authorization for pictures. (upload.single is a middleware function)
// this cant be in auth.js cause we need above code to upload which also needs to be in index.js i guess
app.post("/auth/register", upload.single("picture"), register); //register function is a controller
app.post("/posts", verifyToken, upload.single("picture"), createPost); //upload.single("picture") this grabs picture property in the http call from frontend. this grabs picture and uploads it. picture can be whatever say pic or picalickapicture
//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL;
const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URL || "");
        console.log('MongoDB Connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
    catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};
startServer();

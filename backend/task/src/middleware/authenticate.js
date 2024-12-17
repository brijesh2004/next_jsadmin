import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
    try {
        console.log("Start");
        const token = req.headers['x-access-token'] || req.cookies.admintoken;
        console.log("token" , token);
        if (!token) {
            throw new Error("No token provided");
        }
       
        console.log(process.env.SECRET_KEY);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ 
            _id: verifyToken._id,
            token: token,
        });

        if (!rootUser) {
            throw new Error("User not found or token expired");
        }

        if (rootUser.tokenExpiresAt < Date.now()) {
            throw new Error("Token has expired");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (err) {
        res.status(401).send("Unauthorized: Invalid or expired token");
    }
};

export {authenticate};

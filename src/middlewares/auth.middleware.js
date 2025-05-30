import asyncHandeler from "../utilities/asynchandler.js";
import costumeError from "../utilities/costumError.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "../models/user.model.js";
dotenv.config()

export const verifyJWT = asyncHandeler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new costumeError(404, "Unauthorized request [ no access/refresh Token ] ")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id).select("-password -refrehToken")
        if (!user) {
            throw new costumeError(401, "Invalid access token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new costumeError(500, "internal server error while verifying user")
    }
})
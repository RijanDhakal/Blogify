import asyncHandeler from "../utilities/asynchandler.js";
import costumeError from "../utilities/costumError.js";
import APIresponse from "../utilities/APIresponse.js";
import { User } from "../models/user.model.js"
import uploadOnCloud from "../utilities/uploadOncloudinary.js";
import fs from "fs"

const generateRefreshAndAcessToken = async function (userID) {
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // saving refresh token inside user model [document]
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new costumeError(500, "internal servor error while generating refresh and accessToken")
    }
}

const registerUser = asyncHandeler(async (req, res) => {
    const { username, password } = req.body
    const profile_path = req.file?.path

    if ([username, password].some((field) => field.trim() === "")) {
        if (profile_path) {
            fs.unlinkSync(profile_path)
        }
        return res.status(404)
            .json(
                {
                    "message": "Fields cannot be empty"
                }
            )
        // throw new costumeError(404, "Fields cannot be empty");
    }

    const avaliableUser = await User.findOne({ username })
    if (avaliableUser) {
        fs.unlinkSync(profile_path)
        return res.status(404)
            .json(
                {
                    "message": "User already exits"
                }
            )
        // throw new costumeError(400, "User already exists")
    }

    if (!profile_path) {
        return res.status(404)
            .json(
                {
                    "message": "Picture not found"
                }
            )
        // throw new costumeError(402, "profile picture not found")
    }

    const profile = await uploadOnCloud(profile_path)
    const user = await User.create({
        username: username,
        password: password,
        profile: profile.url
    })

    const registeredUser = await User.findById(user._id).select("-password")
    if (!registeredUser) {
        return res.status(500)
            .json(
                {
                    "message": "Internal servor error"
                }
            )
        // throw new costumeError(500, "Couldn't register user [Internal Server Error]")
    }

    // console.log(registeredUser)

    return res.status(200)
        .json(
            new APIresponse(200, registeredUser, "User Registered Sucessfully")
        )

})

const loginUser = asyncHandeler(async (req, res) => {
    const { username, password } = req.body
    if ([username, password].some((field) => field?.trim() == "")) {
        // throw new costumeError(401, "Fields cannot be empty")
        return res.status(400)
            .json(
                {
                    "message": "Fields cannot be empty"
                }
            )
    }

    const user = await User.findOne({ username })
    if (!user) {
        // throw new costumeError(404, "User not found")
        return res.status(404)
            .json(
                {
                    "message": "User not found"
                }
            )
    }

    const isPasswprdCorrect = await user.isPasswordValid(password)
    if (!isPasswprdCorrect) {
        // throw new costumeError(400, "Incorrect password")
        return res.status(404)
            .json(
                {
                    "message": "Incorrect password"
                }
            )
    }

    const { accessToken, refreshToken } = await generateRefreshAndAcessToken(user._id)
    const updatedUser = await User.findByIdAndUpdate(user._id,
        {
            $set:{
                refreshToken : refreshToken
            }
        },
        {
            new : true
        }
    )
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        // httpOnly: true,// for deployable web
        httpOnly:false,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure : true
        })
        .json(
            new APIresponse(200, loggedInUser, "User loggedIn sucessfully")
        )

})

const logoutUser = asyncHandeler(async (req, res) => {
    await User.findOneAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1 //true
            }
        },
        {
            new: true
        })
    const option = {
        // httpOnly: true,// for deployable web
        httpOnly:false,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new APIresponse(200, [], "User loggedOut sucessFully")
        )
})

export {
    registerUser,
    loginUser,
    logoutUser
}
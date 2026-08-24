import uploadOnCloudinary from "../config/cloudinary.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import validator from 'validator'
import bcrypt from 'bcrypt'

export const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(401).json({ message: "User is already exist" });
        }

        if (!validator.isEmail(email)) {
            return res.status(402).json({ message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.status(403).json({ message: "Enter strong password" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
            
        }

        const user = await User.create({
            username:userName,
            email,
            password: hashPassword,
            imageUrl
        });

        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            user,
            message: "Signup successful"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "signup error",
            error: error.message
        });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(406).json({
                message: "User is not found"
            })
        }

        const matchPassword = await bcrypt.compare(
            password,
            user.password
        )

        if (!matchPassword) {
            return res.status(407).json({
                message: "Incorrect Password"
            })
        }

        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(
            await User.findById(user._id).select("-password")
        )

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: `Signin error: ${error.message}`
        })
    }
}


export const signOut = async (req, res) => {
    try {
        await res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })
        return res.status(200).json({
            message: "Signout successful"
        })
    } catch (error) {
        return res.status(500).json({message: `Signout error ${error}`})
    }
}

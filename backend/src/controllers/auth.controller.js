import uploadOnCloudinary from "../config/cloudinary.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import sendMail from "../config/sendMail.js"

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
            message: "Signup successfully"
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

export const googleAuth = async (req, res) => {
    try {
        const {
            userName, 
            email, 
            imageUrl} = req.body

        let googleImage = imageUrl
        if (imageUrl) {
            try {
                googleImage = await uploadOnCloudinary(imageUrl)
            } catch (error) {
                console.log("Cloudinary upload failed");
                
            }
        }

        if (!email) {
            return res.status(400).json({
                message: "Google email is required"
            })
        }
        const user = await User.findOne({email})

        if (!user) {
            let username = userName?.trim()

            if (!username) {
                username = email.split("@")[0]
            }

            const existingUsername = await User.findOne({ username })

            if (existingUsername) {
                username = `${username}_${Date.now()}`
            }

            await User.create({
                userName,
                email,
                imageUrl:googleImage
            })
        }else{
            if (!user.imageUrl && googleImage) {
                user.imageUrl = googleImage
                await user.save()
            }
        }

        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({message:`GoogleAuth error ${error}`})
        
    }
}


export const sentOtp = async (req, res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json("User not Found");
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();

        await sendMail(email, otp)

        return res.status(200).json({message:"OTP sent successfully"})

    } catch (error) {
        return res.status(500).json({message:`OTP sent errer ${error}`})
    }
}


export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body
        const user = await User.findOne({email})
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.resetOtp = undefined,
        user.otpExpires = undefined,
        user.isOtpVerified = true

        await user.save()
        return res.status(200).json({message:"OTP verified successfully"})
    } catch (error) {
        return res.status(500).json({message:`OTP verification error ${error}`})
    }
}


export const resetPassword = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({message: "OTP verification required"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword,
        user.isOtpVerified = false,

        await user.save()
        return res.status(200).json({message: "Password reset successfully"})
    } catch (error) {
        return res.status(500).json({message: `Password reset error ${error}`})
    }
}
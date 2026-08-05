import uploadOnCloudinary from "../config/cloudinary"
import genToken from "../config/token"
import User from "../models/user.model"
import validator from 'validator'
import bcrypt from 'bcrypt'

export const signUp = async (req,res)=>{
    try {
        const {username, email, password} = req.body
        let imageUrl
        if(req.file){
            imageUrl = await uploadOnCloudinary(req.file.path)
        }

        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(401).json({message: "User is already exist"})
        }

        if (!validator.isEmail(email)) {
            return res.status(402).json({message: "Invalid email"})
        }

        if (password.length < 8) {
            return res.status(403).json({message: "Enter strong password"})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            username,
            email,
            password:hashPassword,
            imageUrl
        })

        let token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            samesite:"Strict",
            maxAge: 7*24*60*60*1000
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message: `Signup error ${error}`})
    }
}

export const signIn = async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if (!user) {
            return res.status(406).json({message: "User is not found"})
        }

        const matchPassword = await bcrypt(password,user.password)

        if (!matchPassword) {
            return res.status(407).json({message: "Incorrect Password"})
        }
        let token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            samesite:"Strict",
            maxAge: 7*24*60*60*1000
        })
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Signup error ${error}`})
    }
}


export const signOut = async (req, res) => {
    try {
        await res.clearCookie("token")
    } catch (error) {
        return res.status(500).json({message: `Signout error ${error}`})
    }
}
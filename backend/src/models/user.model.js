import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type:String,
            required: true,
            unique: true
        },
        password: {
            type:String
        },
        photoUrl: {
            type:String,
            default: ""
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel"
        },
        resetOtp: {type: String},
        otpExpires: {type: Date},
        isOtpVerified: {type: Boolean, default: false},

    },
    {timestamps:true})

    const User = mongoose.model("User", userSchema)

    export default User;
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
        imageUrl: {
            type:String,
            default: ""
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel"
        }
    },
    {timestamps:true})

    const User = mongoose.model("User", userSchema)

    export default User;
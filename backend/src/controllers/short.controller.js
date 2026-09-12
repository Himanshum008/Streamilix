import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channel.model.js"
import Short from "../models/short.model.js"


export const CreateShort = async (req , res) => {
    try {
        const {title, description, tags, channelId} = req.body
        if (!title || !channelId) {
            return res.status(400).json({message:"Short title and channelId is required"})
        }
        let shortUrl
        if (req.file) {
            shortUrl = await uploadOnCloudinary(req.file.path)
        }

        const ChannelData = await Channel.findById(channelId)
        if (!ChannelData) {
            return res.status(400).json({message:"Channel is not found"})
        }
        const newShort = await Short.create({
            channel:channelId,
            title,
            description,
            shortUrl,
            tags:tags ? JSON.parse(tags) : []
        })

        await Channel.findByIdAndUpdate(ChannelData._id,{
            $push : {shorts : newShort._id}
        },{returnDocument:"after"})

        return res.status(200).json(newShort)
    } catch (error) {
        return res.status(500).json({message:`Failed to create short ${error}`})
    }
}

export const getAllShorts = async (req, res) => {
    try {
        const shorts = await Short.find().sort({createdAt : -1}).populate("channel comments.author comments.replies.author")
        if (!shorts) {
            return res.status(400).json({message: "Shorts are not found"})
        }
        return res.status(200).json(shorts)
    } catch (error) {
        return res.status(500).json({message: `Failed to get shorts ${error}`})
    }
}

export const toggleLikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }
        if (short.likes.includes(userId)) {
            short.likes.pull(userId)
        }else{
            short.likes.push(userId)
            short.dislikes.pull(userId)
        }
        await short.populate("comments.author", "username photoUrl")
        await short.populate("channel")
        await short.populate("comments.replies.author", "username photoUrl")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({message:`Failed to like short ${error}`})
    }
}

export const toggleDislikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }
        if (short.dislikes.includes(userId)) {
            short.dislikes.pull(userId)
        }else{
            short.dislikes.push(userId)
            short.likes.pull(userId)
        }
        await short.populate("comments.author", "username photoUrl")
        await short.populate("channel")
        await short.populate("comments.replies.author", "username photoUrl")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({message:`Failed to dislike short ${error}`})
    }
}

export const toggleSave1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }
        if (short.saveBy.includes(userId)) {
            short.saveBy.pull(userId)
        }else{
            short.saveBy.push(userId)
        }
        await short.populate("channel")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({message:`Failed to save short ${error}`})
    }
}

export const getViews1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const short = await Short.findByIdAndUpdate(shortId , {
            $inc : {views : 1}
        },{returnDocument:"after"})
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }
        await short.populate("comments.author", "username photoUrl")
        await short.populate("channel")
        await short.populate("comments.replies.author", "username photoUrl")
        return res.status(200).json(short)

    } catch (error) {
        return res.status(500).json({message:`Error adding view ${error}`})
    }
}

export const addComment1 = async (req, res) => {
    try {
        const {shortId} = req.params
        const {message} = req.body
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }

        short?.comments?.push({author : userId , message})
        await short.save()
        await short.populate("comments.author", "username photoUrl")
        await short.populate("channel")
        await short.populate("comments.replies.author", "username photoUrl")
        
        return res.status(200).json(short)

    } catch (error) {
        return res.status(500).json({message:`Error adding comments ${error}`})
    }
}

export const addReply1 = async (req, res) => {
    try {
        const {shortId , commentId} = req.params
        const {message} = req.body;
        const userId = req.userId;

         const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message:"Short is not found"})
        }

        const comment = await short.comments.id(commentId)
        if (!comment) {
            return res.status(400).json({message:"Comment is not found"})
        }
        comment.replies.push({author:userId , message})
        await short.save()
        await short.populate("comments.author", "username photoUrl")
        await short.populate("channel")
        await short.populate("comments.replies.author", "username photoUrl")

        return res.status(200).json(short)

    } catch (error) {
        return res.status(500).json({message:`Error adding reply ${error}`})
    }
}

export const getLikedShort = async (req, res) => {
    try {
        const userId = req.userId

        const likedShort = await Short.find({likes : userId})
        .populate("channel", "name avatar")
        .populate("likes", "username")

        if (!likedShort) {
            return res.status(400).json({message: "Failed to get liked shorts"})
        }
        return res.status(200).json(likedShort)
    } catch (error) {
        return res.status(500).json({message: `Error to find liked shorts ${error}`})
    }
}
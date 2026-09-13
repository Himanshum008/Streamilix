import path from "path"
import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channel.model.js"
import User from "../models/user.model.js"
import Video from "../models/video.model.js"
import Short from "../models/short.model.js"



export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(404).json({message:"User is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}


export const createChannel = async (req, res) => {
    try {
        const {name, description, category} = req.body
        const userId = req.userId

        const existingChannel = await Channel.findOne({Owner:userId})
        if (existingChannel) {
            return res.status(400).json({message: "User already have a channel"})
        }

        const nameExist = await Channel.findOne({name})
        if (nameExist) {
            return res.status(400).json({message: "Channel name already taken, choose other name"})
        }
        let avatar
        let banner

        if(req.files?.avatar) {
            avatar = await uploadOnCloudinary(req.files.avatar[0].path)
        }
        if(req.files?.banner){
            banner = await uploadOnCloudinary(req.files.banner[0].path)
        }

        const channel = await Channel.create({
            name,
            description,
            category,
            avatar,
            banner,
            Owner:userId
        })

        await User.findByIdAndUpdate(userId, {
            channel: channel._id,
            username:name,
            photoUrl: avatar
        })

        return res.status(201).json(channel)
    } catch (error) {
        return res.status(500).json({message:`Create channel error ${error}`})
    }
}


export const updateChannel = async (req, res) => {
    try {
        const {name, description, category} = req.body
        const userId = req.userId

        const channel = await Channel.findOne({Owner:userId})
        if (!channel) {
            return res.status(404).json({message: "Channel is not found"})
        }
        if (name && name !== channel.name) {
            const nameExists = await Channel.findOne({name})
        if (nameExists) {
            return res.status(400).json({message: "Channel name already taken, choose other name"})
        }
        channel.name = name
        }
        if (description !== undefined) {
            channel.description = description
        }
        if (category !==undefined) {
            channel.category = category
        }
        if(req.files?.avatar) {
            const avatar = await uploadOnCloudinary(req.files.avatar[0].path)
            channel.avatar = avatar
        }
        if(req.files?.banner){
            const banner = await uploadOnCloudinary(req.files.banner[0].path)
            channel.banner = banner
        }
        const updatedChannel = await channel.save()

        await User.findByIdAndUpdate(userId, {
            username:name || undefined,
            photoUrl: channel.avatar || undefined
        },{returnDocument:"after"})

        return res.status(200).json(updatedChannel)

    } catch (error) {
        return res.status(500).json({message:`Update chaannel error ${error}`})
    }
}


export const getChannelData = async (req, res) => {
    try {
        const userId = req.userId
        const channel = await Channel.findOne({Owner:userId}).populate("Owner").populate("videos").populate("shorts")

        if (!channel) {
            return res.status(404).json({message: "Channel is not found"})
        }

        return res.status(200).json(channel)
    } catch (error) {
        return res.status(404).json({message: ` Failed to get Channel ${error}`})
    }
}

export const toggleSubscribe = async (req, res) => {
    try {
        const {channelId} = req.body
        const userId = req.userId

        if (!channelId) {
            return res.status(400).json({message:"Channel Id is required"})
        }
        const channel = await Channel.findById(channelId)
        if (!channel) {
            return res.status(400).json({message:"Channel is not found"})
        }
        const isSubscribed = channel?.subscribers?.some(
            subscriber => subscriber.toString() === userId.toString()
        )

        if (isSubscribed) {
            channel?.subscribers.pull(userId)
        }else {
            channel?.subscribers.push(userId)
        }
        await channel.save()

        const updatedChannel = await Channel.findById(channelId).populate("Owner")
        .populate("videos").populate("shorts")
        return res.status(200).json(updatedChannel)
    } catch (error) {
        return res.status(404).json({message: ` Failed to toggleSubscribe ${error}`})
    }
}

export const getAllChannelData = async (req, res) => {
    try {
        const channels = await Channel.find().populate("Owner")
        .populate("videos")
        .populate("shorts")
        .populate("subscribers")
        .populate({
            path: "communityPosts",
            populate: [
            {
                path: "channel",
                model: "Channel",
            },
            {
                path: "comments.author",
                model: "User",
                select:  "username photoUrl"
            },
            {
                path: "comments.replies.author",
                model: "User",
                select: "username photoUrl"
            },
        ],
        })
        .populate("playlists")
            .populate({
                path: "playlists",
                populate: {
                    path: "videos",
                    model: "Video",
                },
            })

        if (!channels) {
            return res.status(400).json({message:"Channels are not found"})
        }
        return res.status(200).json(channels)
    } catch (error) {
        return res.status(500).json({message:`Failled to get all channels ${error}`})
    }
}

export const getSubscribedData = async (req,res) => {
    try {
        const userId = req.userId

        const subscribedChannels = await Channel.find({subscribers:userId})
        .populate({
            path: "videos",
            populate: { path: "channel", select: "name avatar" }
        })
        .populate({
            path: "shorts",
            populate: { path: "channel", select: "name avatar" }
        })
        .populate({
            path: "playlists",
            populate: { path: "channel", select: "name avatar" },
            populate : {
            path: "videos",
            populate: { path: "channel" }
        }
        })
        .populate({
            path: "communityPosts",
            populate:[
                {path: "channel", select: "name avatar"},
                {path: "comments.author", select: "username photoUrl email"},
                {path: "comments.replies.author", select: "username photoUrl email"},
            ]
    })

        if (!subscribedChannels || subscribedChannels.length === 0) {
            return res.status(404).json({message: "Failed to find Subscribed Channels"})
        }

        const videos = subscribedChannels.flatMap((ch => ch.videos))
        const shorts = subscribedChannels.flatMap((ch => ch.shorts))
        const playlists = subscribedChannels.flatMap((ch => ch.playlists))
        const posts = subscribedChannels.flatMap((ch => ch.communityPosts))

        return res.status(200).json({
            subscribedChannels,                                  
            videos,
            shorts,
            playlists,
            posts
        })
    } catch (error) {
        return res.status(500).json({message: `Server error while fetching subscribed content ${error}`})
    }
}


export const addHistory = async (req,res) => {
    try {
        const userId = req.userId
        const {contentId, contentType} = req.body

        if (!["Video", "Short"].includes(contentType)) {
            return res.status(400).json({message: "Invalid contentType"})
        }

        let content
        if (contentType === "Video") {
            content = await Video.findById(contentId)
        }else{
            content = await Short.findById(contentId)
        }
        if (!content) {return res.status(404).json({message: `${contentType} not found`})}
        
        await User.findByIdAndUpdate(userId, {
            $pull: {history: {contentId, contentType}}
        })

        await User.findByIdAndUpdate(userId , {
            $push: {
                history: {contentId, contentType, watchedAt: new Date()}
            }
        })

        return res.status(200).json({message: "Added to history"})

    } catch (error) {
        console.error("addToHistory error", error);
        res.status(500).json({message: "Server error"})
    }
}


export const getHistory = async (req,res) => {
    try {
        const userId = req.userId

        const user = await User.findById(userId)
        .populate({
            path: "history.contentId",
            populate: {
            path: "channel",
            select: "name avatar",
        },
    })
    .select("history")

    if(!user) {return res.status(404).json({message: "User not found"})}

    const sortedHistory = [...user.history].sort(
        (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    )

    res.status(200).json(sortedHistory)

    } catch (error) {
        console.error("History fetch error", error)
        res.status(500).json({message: "Server error"})
    }
}
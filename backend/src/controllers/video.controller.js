import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channel.model.js"
import Video from "../models/video.model.js"



export const createVideo = async (req,res) => {
    try {
        const {title, description, tags, channelId} = req.body

        if (!title || !req.files.video || !req.files.thumbnail || !channelId) {
            return res.status(400).json({message:"title, videoUrl, thumbnail, channelId is required"})
        }

        const ChannelData = await Channel.findById(channelId)
        if (!channelId) {
            return res.status(400).json({message:"Channel is not found by Id"})
        }

        const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
        const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

        let parsedTag = []
        if (tags) {
            try {
                parsedTag = JSON.parse(tags)
            } catch (error) {
                parsedTag = []
            }
        }

        const newVideo = await Video.create({
            title,
            channel:ChannelData._id,
            description,
            tags:parsedTag,
            videoUrl:uploadVideo,
            thumbnail:uploadThumbnail
        })
        await Channel.findByIdAndUpdate(ChannelData._id,
            {$push : {videos : newVideo._id}},
            {returnDocument:"after"}
        )
        return res.status(200).json(newVideo)

    } catch (error) {
        return res.status(500).json({message: `Failed to create video ${error}`})
    }
}

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({createdAt : -1}).populate("channel comments.author comments.replies.author")
        if (!videos) {
            return res.status(400).json({message: "Videos are not found"})
        }
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message: `Failed to get videos ${error}`})
    }
}

export const toggleLikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }
        if (video.likes.includes(userId)) {
            video.likes.pull(userId)
        }else{
            video.likes.push(userId)
            video.dislikes.pull(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`Failed to like video ${error}`})
    }
}

export const toggleDislikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }
        if (video.dislikes.includes(userId)) {
            video.dislikes.pull(userId)
        }else{
            video.dislikes.push(userId)
            video.likes.pull(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`Failed to dislike video ${error}`})
    }
}

export const toggleSave = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }
        if (video.saveBy.includes(userId)) {
            video.saveBy.pull(userId)
        }else{
            video.saveBy.push(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`Failed to save video ${error}`})
    }
}

export const getViews = async (req, res) => {
    try {
        const {videoId} = req.params
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        )
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }
        return res.status(200).json(video)

    } catch (error) {
        return res.status(500).json({message:`Error adding view ${error.message}`})
    }
}

export const addComment = async (req, res) => {
    try {
        const {videoId} = req.params
        const {message} = req.body
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }

        video?.comments?.push({author : userId , message})
        await video.save()
        const populatedVideo = await Video.findById(videoId)
        .populate({
            path: "comments.author",
            select: "username photoUrl email"
        })
        .populate({
            path: "comments.replies.author",
            select: "username photoUrl email"
        });
        return res.status(200).json(populatedVideo)

    } catch (error) {
        return res.status(500).json({message:`Error adding comments ${error}`})
    }
}

export const addReply = async (req, res) => {
    try {
        const {videoId , commentId} = req.params
        const {message} = req.body;
        const userId = req.userId;

         const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message:"Video is not found"})
        }

        const comment = await video.comments.id(commentId)
        if (!comment) {
            return res.status(400).json({message:"Comment is not found"})
        }
        comment.replies.push({author:userId , message})
        await video.save()

        const populatedVideo = await Video.findById(videoId)
        .populate({
            path: "comments.author",
            select: "username photoUrl email"
        })
        .populate({
            path: "comments.replies.author",
            select: "username photoUrl email"
        });
        return res.status(200).json(populatedVideo)

    } catch (error) {
        return res.status(500).json({message:`Error adding reply ${error}`})
    }
}
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
            {new:true}
        )
        return res.status(200).json(newVideo)

    } catch (error) {
        return res.status(500).json({message: `Failed to create video ${error}`})
    }
}
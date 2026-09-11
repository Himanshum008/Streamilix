import Channel from "../models/channel.model.js"
import Playlist from "../models/playlist.model.js"
import Video from "../models/video.model.js"



export const CreatePlaylist = async (req, res) => {
    try {
        const {title, description, channelId, videoIds} = req.body

        if (!title || !channelId) {
            return res.status(400).json({message:"To create playlist , title and channelId are required"})
        }

        const channel = await Channel.findById(channelId)
        if (!channel) {
            return res.status(400).json({message:"Channel is not found"})
        }
        const videos = await Video.find({
            _id : {$in : videoIds},
            channel:channelId
        })
        if (videos.length !== videoIds.length) {
           return res.status(400).json({message:"Some videos are not found"}) 
        }

        const playlist = await Playlist.create({
            title, 
            description,
            channel:channelId,
            videos:videoIds
        })

        await Channel.findByIdAndUpdate(channelId,{
            $push : {playlists : playlist._id}
        })
        return res.status(200).json(playlist)
    } catch (error) {
        return res.status(500).json({message:`Failed to create playlist ${error}`})
    }
}

export const toggleSavePlaylist = async (req, res) => {
    try {
        const {playlistId} = req.body;
        const userId = req.userId

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            return res.status(400).json({message:"Playlist is not found"})
        }
        if (playlist.saveBy.includes(userId)) {
            playlist.saveBy.pull(userId)
        }else{
            playlist.saveBy.push(userId)
        }
        await playlist.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`Failed to save video ${error}`})
    }
}
import path from "path"
import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channel.model.js"
import User from "../models/user.model.js"
import Video from "../models/video.model.js"
import Short from "../models/short.model.js"
import { title } from "process"



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
        const channel = await Channel.findOne({Owner:userId})
        .populate("Owner")
        .populate("videos")
        .populate("shorts")
        .populate({
            path: "subscribers.user",
            select: "username photoUrl email"
        })
        .populate({
            path: "communityPosts",
            populate: {
                path: "channel",
                model: "Channel",
            },
        })
        .populate({
            path: "playlists",
            populate: {
                path: "videos",
                model: "Video",
                populate: {
                    path: "channel",
                    model: "Channel",
                },
            },
        })

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
        const { channelId } = req.body;
        const userId = req.userId;

        if (!channelId) {
            return res.status(400).json({
                message: "Channel Id is required"
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "User is not authenticated"
            });
        }

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                message: "Channel is not found"
            });
        }

        channel.subscribers = channel.subscribers.filter(
            (subscriber) => subscriber.user
        );

        const existingSubscriber = channel.subscribers.find(
            (subscriber) =>
                subscriber.user.toString() === userId.toString()
        );

        if (existingSubscriber) {

            // Unsubscribe
            channel.subscribers.pull(existingSubscriber._id);

        } else {

            // Subscribe
            channel.subscribers.push({
                user: userId,
                subscribedAt: new Date()
            });
        }

        await channel.save();

        const updatedChannel = await Channel.findById(channelId)
            .populate("Owner")
            .populate("videos")
            .populate("shorts")
            .populate({
                path: "subscribers.user",
                select: "username photoUrl"
            });

        return res.status(200).json(updatedChannel);

    } catch (error) {

        console.error("toggleSubscribe error:", error);

        return res.status(500).json({
            message: `Failed to toggleSubscribe ${error}`
        });
    }
};

export const getAllChannelData = async (req, res) => {
    try {
        const channels = await Channel.find().populate("Owner")
        .populate("videos")
        .populate("shorts")
        .populate({
            path: "subscribers.user",
            select: "username photoUrl email"
        })
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

        const subscribedChannels = await Channel.find({"subscribers.user": userId})
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
            populate: [
                { path: "channel", select: "name avatar" },
                {
                    path: "videos",
                    populate: { path: "channel", select: "name avatar" }
                }
            ]
        })
        .populate({
            path: "communityPosts",
            populate:[
                {path: "channel", select: "name avatar"},
                {path: "comments.author", select: "username photoUrl email"},
                {path: "comments.replies.author", select: "username photoUrl email"},
            ]
    })

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


export const getRecommendedContent = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) return res.status(401).json({message: "Unauthorized"})
            
            // get user with history
            const user = await User.findById(userId)
            .populate("history.contentId")
            .lean()
            if (!user) return res.status(404).json({message: "User not found"});

            // collect keyword from history
            const historyKeywords = user.history.map(h => h.contentId?.title || "")

            // collect liked&saved content
            const likedVideos = await Video.find({likes: userId});
            const likedShorts = await Short.find({likes: userId});
            const savedVideos = await Video.find({saveBy: userId});
            const savedShorts = await Short.find({saveBy: userId});

            const likedSavedKeywords = [
                ...likedVideos.map(v => v.title),
                ...likedShorts.map(s => s.title),
                ...savedVideos.map(v => v.title),
                ...savedShorts.map(s => s.title),
            ];

            // merge all keywords
            const allKeywords = [...historyKeywords, ...likedSavedKeywords]
            .filter(Boolean)
            .map(k => k.split(" "))
            .flat();

            // build regex condition
            const videoConditions = [];
            const shortConditions = [];

            allKeywords.forEach(kw => {
                videoConditions.push(
                    {title: {$regex: kw, $options: "i"}},
                    {description: {$regex: kw, $options: "i"}},
                    {tags: {$regex: kw, $options: "i"}}
                );
                 shortConditions.push(
                    {title: {$regex: kw, $options: "i"}},
                    {tags: {$regex: kw, $options: "i"}}
                );
            });

            // recommended content
            const recommendedVideos = await Video.find({$or: videoConditions})
            .populate("channel comments.author comments.replies.author");
            
            const recommendedShorts = await Short.find({$or: shortConditions})
            .populate("channel" , "name avatar")
            .populate("likes" , "username photoUrl");

            // remainig content {exclude rec}
            const recommendedVideoIds = recommendedVideos.map(v => v._id)
            const recommendedShortIds = recommendedShorts.map(s => s._id)

            const remainingVideos = await Video.find({
                _id: {$nin: recommendedVideoIds}
            })
            .sort({createdAt: -1})
            .populate("channel")

            const remainingShorts = await Short.find({
                 _id: {$nin: recommendedShortIds}
            })
            .sort({createdAt: -1})
            .populate("channel")

            return res.status(200).json({
                recommendedVideos,
                recommendedShorts,
                remainingVideos,
                remainingShorts,
                usedKeywords: allKeywords,
            })
                
    } catch (error) {
        console.error("Recommendation error:", error);
        return res.status(500).json({message: `Failed: ${error.message}`})
    }
}


export const getChannelSubscribers = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Find channel owned by logged-in user
        const channel = await Channel.findOne({
            Owner: userId
        })
            .populate({
                path: "subscribers.user",
                select: "username photoUrl"
            })
            .populate({
                path: "videos",
                select: "_id"
            })
            .populate({
                path: "shorts",
                select: "_id"
            });

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        // IDs of videos uploaded by this channel
        const channelVideoIds = channel.videos.map(
            (video) => video._id.toString()
        );

        // IDs of shorts uploaded by this channel
        const channelShortIds = channel.shorts.map(
            (short) => short._id.toString()
        );

        const subscribers = await Promise.all(
            channel.subscribers.map(async (subscriber) => {

                const user = subscriber.user;

                if (!user) {
                    return null;
                }

                // Get user's watch history
                const subscriberData = await User.findById(user._id)
                    .select("history")
                    .lean();

                const history = subscriberData?.history || [];

                let videosWatched = 0;
                let shortsWatched = 0;

                history.forEach((item) => {

                    const contentId =
                        item.contentId?._id ||
                        item.contentId;

                    if (!contentId) {
                        return;
                    }

                    const id = contentId.toString();

                    // Video watched
                    if (channelVideoIds.includes(id)) {
                        videosWatched++;
                    }

                    // Short watched
                    if (channelShortIds.includes(id)) {
                        shortsWatched++;
                    }
                });

                return {
                    _id: user._id,
                    username: user.username,
                    photoUrl: user.photoUrl,

                    videosWatched,
                    shortsWatched,

                    subscribedAt: subscriber.subscribedAt
                };
            })
        );

        const validSubscribers = subscribers.filter(
            (subscriber) => subscriber !== null
        );

        return res.status(200).json({
            success: true,
            subscribers: validSubscribers,
            totalSubscribers: validSubscribers.length
        });

    } catch (error) {

        console.error(
            "getChannelSubscribers error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch subscribers",
            error: error.message
        });
    }
};
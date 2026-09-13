import {GoogleGenAI} from "@google/genai"
import dotenv from "dotenv";

import Video from "../models/video.model.js";
import Channel from "../models/channel.model.js";
import Short from "../models/short.model.js";
import Playlist from "../models/playlist.model.js";

dotenv.config();

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input || !input.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
You are a search assistant for a video streaming platform.

The user query is:
"${input}"

Your job:
- Correct any spelling mistakes.
- If the query contains multiple words, identify meaningful search keywords.
- Return only the corrected keywords.
- Separate multiple keywords with commas.
- Do not explain anything.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const keyword = (response.text || input)
            .trim()
            .replace(/[\n\r]+/g,"");

        const searchWords = keyword
            .split(",")
            .map((word) => word.trim())
            .filter(Boolean);

        const buildRegexQuery = (fields) => ({
            $or: searchWords.flatMap((word) =>
                fields.map((field) => ({
                    [field]: {
                        $regex: word,
                        $options: "i"
                    }
                }))
            )
        });

        // Search channels
        const matchedChannels = await Channel.find({
            name: {
                $regex: keyword,
                $options: "i"
            }
            }).select("_id name avatar");

        const channelIds = matchedChannels.map(
            (channel) => channel._id
        );

        // Search videos
    const videos = await Video.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          description: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          tags: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          channel: {
            $in: channelIds
          }
        }
      ]
    }).populate("channel");

    // Search shorts
    const shorts = await Short.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          tags: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          channel: {
            $in: channelIds
          }
        }
      ]
    })
    .populate("channel", "name avatar")
    .populate("likes", "username photoUrl");

    // Search playlists
    const playlists = await Playlist.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          description: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          channel: {
            $in: channelIds
          }
        }
      ]
    })
    .populate("channel", "name avatar")
    .populate({
      path: "videos",
      populate: {
        path: "channel",
        select: "name avatar"
      }
    });

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists
    });

    } catch (error) {
        console.error("AI Search Error:", error);

        return res.status(500).json({
            message: "Failed to search",
            error: error.message
        });
    }
};


export const filterCategoryWithAi = async (req,res) => {
    try {
    const {input} = req.body
    if (!input || !input.trim()) {
      return res.status(400).json({message: "Category is required"})
    }

    const escapedCategory = input.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const channels = await Channel.find({
      category: {$regex: escapedCategory, $options: "i"}
    })

    const channelIds = channels.map((channel) => channel._id)
    const videos = await Video.find({channel: {$in: channelIds}})
      .populate("channel comments.author comments.replies.author")
    const shorts = await Short.find({channel: {$in: channelIds}})
      .populate("channel", "name avatar")
        .populate({
      path: "likes",
      select: "username photoUrl"
    })
    const playlists = await Playlist.find({channel: {$in: channelIds}})
      .populate("channel", "name avatar")
      .populate({path: "videos", populate: {path: "channel", select: "name avatar"}})

    return res.status(200).json({videos, shorts, channels, playlists, keywords: [input.trim()]})

    } catch (error) {
        console.error("Filter error:", error);
        return res.status(500).json({message: `FAiled to filter: ${error.message}`})
    }
}
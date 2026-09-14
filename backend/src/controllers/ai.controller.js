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
    if (!input) {
      return res.status(400).json({message: "Search query is required"})
    }

     const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

    const categories = [
      "Music", "Gaming", "Movies", "TV Shows", "News", "Trending", "Entertainment", "Education", "Science & Tech", "Travel",
    "Fashion", "Cooking", "Sports", "Pets", "Art", "Comedy", "Vlogs",
    ]

    const prompt = `You are a category classifier for a video streaming platform. The user query is: ${input}
    
    Your job:
    - Match this query with the most relevant categories from this list:
    ${categories.join(", ")}
    - If more than one category fits, retrun them comma separated.
    -If nothing fits, return the single closest category.
    -Do NOT explain. Do NOT return JSON. Only return category names.
    
    Examples:
    - "arijit singh songs" → "Music"
    - "pubg gameplay" → "Gaming"
    - "netflix web series" → "TV Shows"
    - "india latest news" → "News"
    - "funny animal videos" → "Comedy, Pets"
    - "fitness tips" → "Education, Sports"
    `

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    })

    const keywordText = response.text.trim()
    const keywords = keywordText.split(",").map(k => k.trim())

    const videoConditions = [];
    const shortConditions = [];
    const channelConditions = []; 

    keywords.forEach(kw => {
      videoConditions.push(
        {title: {$regex: kw , $options: "i"}},
        {description: {$regex: kw , $options: "i"}},
        {tags: {$regex: kw , $options: "i"}},
      );
      shortConditions.push(
        {title: {$regex: kw , $options: "i"}},
        {tags: {$regex: kw , $options: "i"}}
      );
      channelConditions.push(
        {title: {$regex: kw , $options: "i"}},
        {category: {$regex: kw , $options: "i"}},
        {description: {$regex: kw , $options: "i"}},
      );
    })

    const videos = await Video.find({$or: videoConditions})
    .populate("channel comments.author comments.replies.author");

    const shorts = await Short.find({$or: shortConditions})
    .populate("channel" , "name avatar")
    .populate("likes", "username photoUrl")



    const channels = await Channel.find({ $or: channelConditions})
    .populate("Owner", "username photoUrl")
    .populate("subscribers", "username photoUrl")
    .populate({
      path: "videos", 
      populate: {path: "channel", select:"name avatar"},
    })
    .populate({
      path: "shorts", 
      populate: {path: "channel", select:"name avatar"},
    })


    return res.status(200).json({
      videos, 
      shorts, 
      channels, 
      keywords})

    } catch (error) {
        console.error("Filter error:", error);
        return res.status(500).json({message: `FAiled to filter: ${error.message}`})
    }
}
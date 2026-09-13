import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
import Video from "../models/video.model";
import Channel from "../models/channel.model";
import Short from "../models/short.model";

dotenv.config()

export const searchWithAi = async (req, res) => {
   try {
    const {input} = req.body
    if (!input) {
        return res.status(400).json({message: "Search query is required"})
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY  ,
    });

    const prompt = `You are a search assistant for a video streaming platform. The user query is: "${input}"
    Your job:
    - If query has typos, correct them.
    - If query has multiple words, break them into meaningful keywords.
    - Return only the corrected word(s), comma-separated.
    - Do not explain, only return keyword(s).`;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents:prompt,
    })

    let keyword = (response.text || input).trim().replace(/[\n\r]+/g,"");

    const searchWords = keyword.split(",").map((w)=> w.trim()).filter(Boolean);

    const buildRegexQuery = (fields) => {
        return {
            $or: searchWords.map((word) => ({
                $or: fields.map((field) => ({
                    [field]: {$regex: word, $options:  "i"},
                }))
            }))
        }
    }

    const matchedChannels = await Channel.find(
        buildRegexQuery(["name"])
    ).select("_id name avatar");

    const channelIds = matchedChannels.map((c)=>c._id)

    const videos = await Video.find({
        $or: [
        buildRegexQuery(["title", "description", "tags"]),
        {channel: {$in: channelIds}},
        ],
    }).populate("channel comments.author comments.replies.author");

    const shorts = await Short.find({
        $or: [
            buildRegexQuery(["title", "tags"]),
            {channel: {$in: channelIds}}
        ],
    })
    .populate("channel", "name avatar")

   } catch (error) {
    
   } 
}
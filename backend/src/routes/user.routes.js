import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import { 
    addHistory,
    createChannel,
    getAllChannelData,
    getChannelData,
    getCurrentUser,
    getHistory,
    getRecommendedContent,
    getSubscribedData,
    toggleSubscribe,
    updateChannel
     } from '../controllers/User.controller.js'
import upload from '../middlewares/multer.middleware.js'

const userRouter = express.Router()

userRouter.get("/getuser", isAuth, getCurrentUser);

userRouter.post("/createchannel" , isAuth , upload.fields([
    {name: "avatar" , maxCount:1},
    {name: "banner" , maxCount:1},
]), createChannel)

userRouter.post("/updatechannel" , isAuth , upload.fields([
    {name: "avatar" , maxCount:1},
    {name: "banner" , maxCount:1},
]), updateChannel)

userRouter.get("/getchannel", isAuth, getChannelData)

userRouter.get("/allchanneldata" , isAuth , getAllChannelData)

userRouter.post("/togglesubscribe" , isAuth , toggleSubscribe)

userRouter.get("/subscribed-content" , isAuth , getSubscribedData)

userRouter.post("/add-history" , isAuth , addHistory)

userRouter.get("/gethistory" , isAuth , getHistory)

userRouter.get("/recommendation" , isAuth , getRecommendedContent)

export default userRouter 
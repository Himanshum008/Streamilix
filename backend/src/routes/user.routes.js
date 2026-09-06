import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import { 
    createChannel,
    getChannelData,
    getCurrentUser,
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

userRouter.post("/togglesubscribe" , isAuth , toggleSubscribe)

export default userRouter 
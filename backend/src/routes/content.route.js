import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import { createVideo, getAllVideos } from '../controllers/video.controller.js'
import { CreateShort, getAllShorts } from '../controllers/short.controller.js'


const contentRouter = express.Router()

// Videos Routes
contentRouter.post("/create-video" , isAuth, upload.fields([
    {name:"video" , maxCount:1},
    {name:"thumbnail" , maxCount:1}
]),createVideo)

contentRouter.get("/getallvideos", isAuth , getAllVideos)

//Short Routes
contentRouter.post("/create-short" , isAuth , upload.single("shortUrl"), CreateShort)

contentRouter.get("/getallshorts", isAuth , getAllShorts)

export default contentRouter;
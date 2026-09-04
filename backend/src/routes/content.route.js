import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import { createVideo } from '../controllers/video.controller.js'


const contentRouter = express.Router()

// Videos Routes
contentRouter.post("/create-video" , isAuth, upload.fields([
    {name:"video" , maxCount:1},
    {name:"thumbnail" , maxCount:1}
]),createVideo)

export default contentRouter;
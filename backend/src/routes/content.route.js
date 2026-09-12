import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import { 
    addComment,
    addReply,
    createVideo, 
    getAllVideos, 
    getLikedVideos, 
    getViews, 
    toggleDislikes, 
    toggleLikes, 
    toggleSave 
} from '../controllers/video.controller.js'
import { 
    addComment1, 
    addReply1, 
    CreateShort, 
    getAllShorts, 
    getLikedShort, 
    getViews1, 
    toggleDislikes1, 
    toggleLikes1, 
    toggleSave1 
} from '../controllers/short.controller.js'
import { CreatePlaylist, toggleSavePlaylist } from '../controllers/playlist.controller.js'
import { addCommentForPost, addReplyForPost, createPost, getAllPosts, toggleLikesForPost } from '../controllers/post.controller.js'


const contentRouter = express.Router()

// Videos Routes
contentRouter.post("/create-video" , isAuth, upload.fields([
    {name:"video" , maxCount:1},
    {name:"thumbnail" , maxCount:1}
]),createVideo)

contentRouter.get("/getallvideos", isAuth , getAllVideos)

contentRouter.put("/video/:videoId/toggle-like" , isAuth , toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike" , isAuth , toggleDislikes)
contentRouter.put("/video/:videoId/toggle-save" , isAuth , toggleSave)
contentRouter.put("/video/:videoId/add-view" , getViews)

contentRouter.post("/video/:videoId/add-comment" , isAuth , addComment)
contentRouter.post("/video/:videoId/:commentId/add-reply" , isAuth , addReply)
contentRouter.get("/likedvideo" , isAuth , getLikedVideos)

//Short Routes
contentRouter.post("/create-short" , isAuth , upload.single("shortUrl"), CreateShort)

contentRouter.get("/getallshorts", isAuth , getAllShorts)

contentRouter.put("/short/:shortId/toggle-like" , isAuth , toggleLikes1)
contentRouter.put("/short/:shortId/toggle-dislike" , isAuth , toggleDislikes1)
contentRouter.put("/short/:shortId/toggle-save" , isAuth , toggleSave1)
contentRouter.put("/short/:shortId/add-view" , getViews1)

contentRouter.post("/short/:shortId/add-comment" , isAuth , addComment1)
contentRouter.post("/short/:shortId/:commentId/add-reply" , isAuth , addReply1)
contentRouter.get("/likedshort" , isAuth , getLikedShort)

// Playlist routes

contentRouter.post("/create-playlist" , isAuth , CreatePlaylist)
contentRouter.post("/playlist/toggle-save" , isAuth , toggleSavePlaylist)

//Post routes

contentRouter.post("/create-post" , isAuth , upload.single("image"), createPost)
contentRouter.get("getposts",getAllPosts)
contentRouter.post("/post/toggle-like" , isAuth , toggleLikesForPost)
contentRouter.post("/post/add-comment" , isAuth , addCommentForPost)
contentRouter.post("/post/add-reply" , isAuth , addReplyForPost)

export default contentRouter;
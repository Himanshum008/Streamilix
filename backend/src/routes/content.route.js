import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import { 
    addComment,
    addReply,
    createVideo, 
    deleteVideo, 
    fetchVideo, 
    getAllVideos, 
    getLikedVideos, 
    getSavedVideos, 
    getViews, 
    toggleDislikes, 
    toggleLikes, 
    toggleSave, 
    updateVideo
} from '../controllers/video.controller.js'
import { 
    addComment1, 
    addReply1, 
    CreateShort, 
    deleteShort, 
    fetchShort, 
    getAllShorts, 
    getLikedShort, 
    getSavedShort, 
    getViews1, 
    toggleDislikes1, 
    toggleLikes1, 
    toggleSave1, 
    updateShort
} from '../controllers/short.controller.js'
import { CreatePlaylist, deletePlaylist, fetchPlaylist, getSavedPlaylist, toggleSavePlaylist, updatePlaylist } from '../controllers/playlist.controller.js'
import { 
    addCommentForPost, 
    addReplyForPost, 
    createPost, 
    deletePost, 
    getAllPosts, 
    toggleLikesForPost 
} from '../controllers/post.controller.js'
import { filterCategoryWithAi, searchWithAi } from '../controllers/ai.controller.js'


const contentRouter = express.Router()

// Videos Routes
contentRouter.post("/create-video" , isAuth, upload.fields([
    {name:"video" , maxCount:1},
    {name:"thumbnail" , maxCount:1}
]),createVideo)

//Video Routes
contentRouter.get("/getallvideos", isAuth , getAllVideos)

contentRouter.put("/video/:videoId/toggle-like" , isAuth , toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike" , isAuth , toggleDislikes)
contentRouter.put("/video/:videoId/toggle-save" , isAuth , toggleSave)
contentRouter.put("/video/:videoId/add-view" , getViews)

contentRouter.post("/video/:videoId/add-comment" , isAuth , addComment)
contentRouter.post("/video/:videoId/:commentId/add-reply" , isAuth , addReply)
contentRouter.get("/likedvideo" , isAuth , getLikedVideos)
contentRouter.get("/savedvideo" , isAuth , getSavedVideos)

contentRouter.post("/update-video/:videoId" , isAuth , upload.single("thumbnail") , updateVideo)
contentRouter.delete("/delete-video/:videoId" , isAuth , deleteVideo)
contentRouter.get("/fetchvideo/:videoId" , fetchVideo)

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
contentRouter.get("/savedshort" , isAuth , getSavedShort)

contentRouter.post("/update-short/:shortId" , isAuth , updateShort)
contentRouter.delete("/delete-short/:shortId" , isAuth , deleteShort)
contentRouter.get("/fetchshort/:shortId" , fetchShort)

// Playlist routes

contentRouter.post("/create-playlist" , isAuth , CreatePlaylist)
contentRouter.post("/playlist/toggle-save" , isAuth , toggleSavePlaylist)
contentRouter.get("/savedplaylist" , isAuth , getSavedPlaylist)

contentRouter.post("/update-playlist/:playlistId" , isAuth , updatePlaylist)
contentRouter.delete("/delete-playlist/:playlistId" , isAuth , deletePlaylist)
contentRouter.get("/fetchplaylist/:playlistId" , fetchPlaylist)

//Post routes

contentRouter.post("/create-post" , isAuth , upload.single("image"), createPost)
contentRouter.get("getposts",getAllPosts)
contentRouter.post("/post/toggle-like" , isAuth , toggleLikesForPost)
contentRouter.post("/post/add-comment" , isAuth , addCommentForPost)
contentRouter.post("/post/add-reply" , isAuth , addReplyForPost)

contentRouter.delete("/delete-post/:postId" , isAuth , deletePost)

//ai routes

contentRouter.post("/search" , isAuth , searchWithAi)
contentRouter.post("/filter" , isAuth , filterCategoryWithAi)

export default contentRouter;
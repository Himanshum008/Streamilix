import express from 'express'
import upload from '../middlewares/multer.middleware.js'
import { signUp, signIn, signOut } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post("/signup", upload.single("imageUrl"),signUp)
authRouter.post("/signin", signIn);
authRouter.get("/signout",signOut)

export default authRouter
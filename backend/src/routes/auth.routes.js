import express from 'express'
import upload from '../middlewares/multer.middleware.js'
import { signUp, signIn } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post("/signup", upload.single("imageUrl"),signUp)
authRouter.post("/signin", singnIn)
authRouter.post("/signout", signout)

export default authRouter
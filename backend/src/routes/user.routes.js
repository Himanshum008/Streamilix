import express from 'express'
import isAuth from '../middlewares/isAuth.middleware.js'
import { getCurrentUser } from '../controllers/User.controller.js'

const userRouter = express.Router()

userRouter.get("/getuser", isAuth, getCurrentUser)

export default userRouter 
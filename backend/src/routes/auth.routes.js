import express from 'express'
import upload from '../middlewares/multer.middleware.js'
import { signUp, 
    signIn, 
    signOut, 
    googleAuth, 
    sentOtp, 
    verifyOtp, 
    resetPassword 
} from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post("/signup", upload.single("imageUrl"),signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout",signOut);
authRouter.post("/googleauth",upload.single("imageUrl"), googleAuth);
authRouter.post("/sendotp", sentOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)

export default authRouter
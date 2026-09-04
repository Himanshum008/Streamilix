import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import authRouter from './src/routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './src/routes/user.routes.js'
import contentRouter from './src/routes/content.route.js'

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRouter)
app.use("/api/user", userRouter)
app.use("/api/content", contentRouter)

app.listen(port, ()=>{
    console.log(`Server started ${port}`);  
    connectDB()
})
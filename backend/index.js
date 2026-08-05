import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import authRouter from './src/routes/auth.routes.js'
import cookieParser from 'cookie-parser'

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000

const app = express()

app.use(cookieParser())
app.use(express.json())



app.use("/api/auth",authRouter)

app.listen(port, ()=>{
    console.log("Server started");  
    connectDB()
})
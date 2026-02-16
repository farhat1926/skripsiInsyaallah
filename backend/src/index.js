import express from 'express'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import patientRoutes from "./routes/patient.routes.js"
import historyRoutes from "./routes/history.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from 'cors'
import path from 'path'

import {app,server } from "./lib/socket.js"

import { connectDB } from './lib/db.js';

dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve()

app.use(express.json({ limit: "100mb" })); 
app.use(express.urlencoded({ extended: true, limit: "100mb" })); 
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

app.use("/api/patient",patientRoutes)
app.use("/api",historyRoutes)


server.listen(PORT,()=>{
    console.log(`running at http://localhost:${PORT}` )
    connectDB()
})
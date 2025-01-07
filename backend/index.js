import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import { app,server } from "./socket/socket.js";
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import path from "path"


const __dirname=path.resolve();





dotenv.config();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // If you're using cookies or HTTP credentials
  }));



//api call
app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)


app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})



server.listen(port, () => {
    connectDb();
    console.log(`app is listening on port ${port}`)
})

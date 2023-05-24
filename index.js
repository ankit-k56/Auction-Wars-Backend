require('dotenv').config();
const express = require("express")
const connectDb = require("./db/connect")
const authRouter = require('./routes/auth')

const app= express()
app.use(express.json())
app.use('/api/auth', authRouter)

app.get("/",(req,res)=>{
    res.send("Home route")
})
const server = async()=>{
    try{
        await(connectDb(process.env.MONGO_URI))
        app.listen(5000, ()=>{
            console.log(`Server is running on port 5000`)
        })
    }
    catch(err){
        console.log(err)
    }

}

server();
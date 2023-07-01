require('dotenv').config();
const express = require("express")
const cors = require('cors');
const connectDb = require("./db/connect")
const authRouter = require('./routes/auth')
const auctionRouter = require('./routes/auction')
const authenticate = require('./middleware/authentication')

const app= express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/auction',authenticate,auctionRouter )

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
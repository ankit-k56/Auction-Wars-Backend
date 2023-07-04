require('dotenv').config();
const express = require("express")
const cors = require('cors');
const SocjetIo = require('socket.io')
const Auction = require('./models/Auction')
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
        var sr =app.listen(5000, ()=>{
            console.log(`Server is running on port 5000`)
        })
        const io = SocjetIo(sr,{
            cors:{
                origin:"http://127.0.0.1:5173"
            }
        });
        io.on("connection", (socket)=>{
            console.log("Connected to socket io")
            socket.on('userJoined',(data)=>{
                const {userId, name, roomId} = data;
                Auction.findByIdAndUpdate(roomId,{
                    $push: {bidders:userId},
                    
                } , {new:true}).then((updatedAuction)=>{
                    // console.log(updatedAuction);
                })
                socket.join(roomId);
                console.log(`User ${name} joined room ${roomId}`);
                
            })
            socket.on('newBid',(data)=>{
                const {amount, roomId} = data;
                Auction.findByIdAndUpdate(roomId,{
                    highestBid: amount
                },{new:true}).then((j)=>{
                    console.log(j);
                })
                socket.in(roomId).emit('new highest bid',amount);
            })
        })
    }
    catch(err){
        console.log(err)
    }

}

server();

require('dotenv').config();
const express = require("express")
const cors = require('cors');
const SocketIo = require('socket.io')
// const Auction = require('./models/Auction')
const connectDb = require("./db/connect")
const authRouter = require('./routes/auth')
const auctionRouter = require('./routes/auction')
const authenticate = require('./middleware/authentication');
const Auction = require('./models/Auction');

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
        const io = SocketIo(sr,{
            cors:{
                origin:"http://127.0.0.1:5173"
            }
        });
        await io.on("connection", async(socket)=>{

            let {roomId} = socket.handshake.query;
            const Prod =  await Auction.findById(roomId);
            // console.log(Prod);
            let timer = Prod.duration;
            if(timer>0){
                // console.log("Room Id"+roomId);
                setInterval(async()=>{
                    // console.log('Hi')
                    timer--;
                    await Auction.findByIdAndUpdate(roomId,{
                        duration : timer
                    },{new:true})
                    socket.emit('timer', timer)
                    // console.log(timer)
                },1000)
            }

            

            console.log("Connected to socket io")
            socket.on('userJoined',async(data)=>{
                const {userId, name} = data;
                await Auction.findByIdAndUpdate(roomId,{
                    $push: {bidders:userId},
                    
                } , {new:true}).then((updatedAuction)=>{
                    console.log(updatedAuction);
                })
                socket.join(roomId);
                console.log(`User ${name} joined room ${roomId}`);
                
            })
            socket.on('newBid',async(data)=>{
                const {amount, userId} = data;
                await  Auction.findByIdAndUpdate(roomId,{
                    highestBid: amount,
                    winner: userId
                },{new:true}).then((j)=>{
                    console.log(j);
                })
                socket.emit('newhbid',amount);
            })
            socket.on('auction-ended', async()=>{
                await Auction.findByIdAndUpdate(roomId,{
                    staus: 'Ended'
                })
            })
        })
    }
    catch(err){
        console.log(err)
    }

}

server();

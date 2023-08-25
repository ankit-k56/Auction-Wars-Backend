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
const globalErrorHandler = require('./middleware/error-handler')
const app= express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/auth', authRouter)
app.use('/api/auction',authenticate,auctionRouter )
app.use('/',express.static('public'))

app.get("/",(req,res, next)=>{
    res.send("Home route")
})
app.get("*", (req,res, next)=>{
    // res.status(400).send("Route not found");
    // next()
    const err = new Error(`${req.originalUrl} route not found`)
    err.statusCode = 404
    err.status = 'fail'

    next(err)

})

app.use(globalErrorHandler)
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

            // let biddersCount =0 ;

            let {roomId,userId, name} = socket.handshake.query;
            socket.join(roomId);
            const Prod =  await Auction.findById(roomId);
            await Auction.findByIdAndUpdate(roomId,{
                $push: {bidders:userId},
                
            } , {new:true}).then((updatedAuction)=>{
                console.log(updatedAuction);
            })
            
            console.log(`User ${name} joined room ${roomId}`);

            // socket.emit('newbidder', ++biddersCount)
            
            
            // console.log(Prod);
            let timer = Prod.duration;
            
                setInterval(async()=>{
                    // console.log('Hi')
                    if(timer>0){
                        timer--;
                    await Auction.findByIdAndUpdate(roomId,{
                        duration : timer
                    },{new:true})
                    socket.emit('timer', timer)
                    // console.log(timer)
                    }
                    
                },1000)
            

            

            console.log("Connected to socket io")
            
            socket.on("user-joined",async(data)=>{
                console.log("hi -1")
                const {userId, name} = data;
                await Auction.findByIdAndUpdate(roomId,{
                    $push: {bidders:userId},
                    
                } , {new:true}).then((updatedAuction)=>{
                    console.log(updatedAuction);
                })
                
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
                socket.to(roomId).emit('newhbid',amount);
            })
            socket.on('auction-ended', async()=>{
                await Auction.findByIdAndUpdate(roomId,{
                    staus: 'Ended'
                })
            })
            socket.on('disconnect', ()=>{
                console.log("user disconnected")
            })
        })
    }
    catch(err){
        console.log(err)
    }

}

server();

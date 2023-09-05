require('dotenv').config();
const express = require("express")
const cors = require('cors');
const SocketIo = require('socket.io')
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
                origin:"https://auction-wars.vercel.app"
            }
        });
        await io.on("connection", async(socket)=>{


            let {roomId,userId, name} = socket.handshake.query;
            socket.join(roomId);
            const Prod =  await Auction.findById(roomId);
            await Auction.findByIdAndUpdate(roomId,{
                $push: {bidders:userId},
                
            } , {new:true}).then((updatedAuction)=>{
                console.log(updatedAuction);
            })
            
            console.log(`User ${name} joined room ${roomId}`);


            let timer = Prod.duration;
            if(timer<=0){
                await Auction.findByIdAndUpdate(roomId,{
                    staus: 'Ended'
                })
            }
            
            setInterval(async()=>{
                if(timer>0){
                    timer--;
                await Auction.findByIdAndUpdate(roomId,{
                    duration : timer
                },{new:true})
                    socket.emit('timer', timer)
                    
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
                let bidder = userId
                socket.to(roomId).emit('newhbid',amount ,bidder);
            })
            socket.on('auction-ended', async()=>{
                await Auction.findByIdAndUpdate(roomId,{
                    staus: 'Ended'
                })
                console.log({m:'auction Ended'})
                socket.to(roomId).emit('ended')
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

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCekcBSvC7uwC-D_O_AD_QSyKexZnDXF54",
//   authDomain: "auction-wars-7ae9e.firebaseapp.com",
//   projectId: "auction-wars-7ae9e",
//   storageBucket: "auction-wars-7ae9e.appspot.com",
//   messagingSenderId: "1057956682802",
//   appId: "1:1057956682802:web:149b58ca12d1221ed2302b",
//   measurementId: "G-6LDBY2QJ6Q"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

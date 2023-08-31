const Auction = require('../models/Auction')
const User = require('../models/User')
const NotFoundError = require('../errors/not-found')
const Badrequest = require('../errors/bad-request')

const fs = require('fs')
const asyncErrorHandler = require('../utils/AsyncErrorHandler')
const path = require('path')


require('dotenv').config()
const GetAllAuctions = async(req, res)=>{
    const auction = await Auction.find({}).populate("bidders").populate('creater')
    res.status(200).json({auction})
}
const GetAuction = asyncErrorHandler(async(req, res,next)=>{ 
  
        const id = req.params.id;
        const auction = await Auction.findById(id).populate('creater').populate("bidders")
        if(!auction){
            throw new NotFoundError(`Auction with id:${id} not found`)
        } 
        res.status(200).json({auction})

})

const PostAuction = asyncErrorHandler(async(req, res)=>{ 
    const { title,description,  initialBid,  startDate, duration, bidders } = req.body;
    if(!title || !description || !initialBid || !startDate || !duration){
        throw new Badrequest('Not all required field provided in request!')
        // next(err)
    }
    const creater = req.user.id;
    // const dir = path.join(__dirname,'../public/')
    // const fl = fs.readdirSync(dir)
    // console.log(fl.find((filename)=>{return filename == req.file.filename}))
    // console.log(fl)
    // console.log(req.file.filename)


    const auction = await Auction.create({title,description, photo:req.file.filename, initialBid, creater, startDate, duration,bidders})
    await User.findByIdAndUpdate(creater,{$push:{postedAuctions:auction._id}},{new:true})
    res.status(200).send({auction})
   
})

const DeleteAuction = async(req, res)=>{ 
    const id = req.params.id;
    const auction = await Auction.findByIdAndDelete(id)
    if(!auction){
        throw new NotFoundError(`Unable to delete, auction with id:${id} not found`)
        
    }
    res.status(200).json({auction})
}
// const UpdateAuctionHighestBid = asyncErrorHandler( async(req,res)=>{ 
//     const {bid} = req.body;
//     const id = req.params.id;
//     const auction = await Auction.findOneAndUpdate({_id:id}, {highestBid: bid}, {returnOriginal:false})
//     res.status(200).json({auction})
// })

const UpdateStatus = asyncErrorHandler(async(req,res)=>{

    const id = req.params.id;
    const auction = await Auction.findByIdAndUpdate(id, {staus:'Ongoing'},{returnOriginal:false})
    res.status(200).json({auction})

})

const RegisterForAuction = asyncErrorHandler( async()=>{
    const id = req.params.id;
    const {userId} = req.body;
    const auction = await Auction.findByIdAndUpdate(id, {$push: {bidders:userId}} , {new:true}) 
    if(!auction){
        throw new NotFoundError(`Unable to register, auction with id:${id} not found`)
        
    }
    res.status(200).send("registered succcelflly")
})

module.exports = {  GetAllAuctions,GetAuction,DeleteAuction, PostAuction, RegisterForAuction ,UpdateStatus}
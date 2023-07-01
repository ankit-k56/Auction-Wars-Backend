const Auction = require('../models/Auction')

require('dotenv').config()
const GetAllAuctions = async(req, res)=>{
    const auction = await Auction.find({}).populate("bidders")
    res.status(200).json({auction})
}
const GetAuction = async(req, res)=>{ 
    const id = req.params.id;
    const auction = await  Auction.findById(id).populate('creater').populate("bidders")
    console.log(auction)
    console.log(id)
    
    res.status(200).json({auction})
}
const PostAuction = async(req, res)=>{ 
    const { title,description, photo, initialBid,  startDate, duration, bidders } = req.body;
    const creater = req.user.id;
    const auction = await Auction.create({title,description, photo, initialBid, creater, startDate, duration,bidders})
    res.status(200).send({auction})
}
const DeleteAuction = async(req, res)=>{ 
    const id = req.params.id;
    const auction = await Auction.findByIdAndDelete(id)
    res.status(200).json({auction})
}
const UpdateAuctionHighestBid = async(req,res)=>{ 
    const {bid} = req.body;
    const id = req.params.id;
    const auction = await Auction.findOneAndUpdate({_id:id}, {highestBid: bid}, {returnOriginal:false})
    res.status(200).json({auction})
}
const UpdateStatus = async(req,res)=>{
    // const { id } = req.user;
    const id = req.params.id;
    const auction = await Auction.findByIdAndUpdate(id, {staus:'Ongoing'},{returnOriginal:false})
    res.status(200).json({auction})
}
module.exports = {  GetAllAuctions,GetAuction,DeleteAuction, PostAuction, UpdateAuctionHighestBid, UpdateStatus }
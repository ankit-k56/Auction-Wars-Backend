const Auction = require('../models/Auction')

require('dotenv').config()
const GetAllAuctions = async(req, res)=>{
    const auction = await Auction.find({})
    res.status(200).json({auction})
}
const GetAuction = async(req, res)=>(
    res.status(200).send("Single auction end point")

)
const PostAuction = async(req, res)=>{ 
    const { title,description, photo, initialBid, creater, startDate, duration } = req.body;
    const auction = await Auction.create({title,description, photo, initialBid, creater, startDate, duration})
    res.status(200).send({auction})

}
const DeleteAuction = async(req, res)=>{ 
    res.status(200).send("delete auction end point ")
}
const UpdateAuction = async(req,res)=>{ 
    res.status(200).send("Update Auction")
}
module.exports = {  GetAllAuctions,GetAuction,DeleteAuction, PostAuction, UpdateAuction }
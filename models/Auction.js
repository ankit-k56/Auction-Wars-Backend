const mongoose = require('mongoose')

const AuctionSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    initialBid:{
        type: Number,
        default: 0
    },
    creater:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    startDate:{
        type: Date,
        required:true
    },
    duration:{
        type: Number,
        default: 300,
    },
    bidders:[
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    highestBid:{
        type: Number,
        default: function(){
            return this.initialBid
        }
    },
    winner:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    staus:{
        type: String,
        default: 'Upcoming'
    }
})
module.exports = mongoose.model( 'Auction',  AuctionSchema)
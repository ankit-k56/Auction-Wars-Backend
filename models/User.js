const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name'],
    },
    email:{
        type: String,
        required: [true, 'Please provide a email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email',
          ],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Please provide a password']
    },
    address:{
        type: String,
        required: [true, 'Please provide a address']
    },

    auctionsWon:[
        {
            type:mongoose.Types.ObjectId,
            ref : 'Auction'
        }
    ],
    postedAuctions:[
        {
            type:mongoose.Types.ObjectId,
            ref : 'Auction'
        }
    ]

    
})
module.exports = mongoose.model('User', UserSchema)
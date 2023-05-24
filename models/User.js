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
        // required: [true, 'Please provide a address']
    },

    // purchasedItems:[
    //     {
    //         type:mongoose.Types.ObjectId,
    //         ref:'auction'
    //     }
    // ],
    // postedAuctions:[
    //     {
    //         typeof:mongoose.Types.ObjectId,
    //         ref:'auction'
    //     }
    // ]

})
module.exports = mongoose.model('User', UserSchema)
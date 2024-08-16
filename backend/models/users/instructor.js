const mongoose = require('mongoose')
const User = require('./user')
const options = { discriminatorKey: 'kind' };

const Instructor =User.discriminator('Instructor',new mongoose.Schema({
    ratings: [{ 
        type: mongoose.Types.ObjectId,
        ref: "rating", 
        default: [] 
    }],
    miniBiography: {
        type: String,
        default:""
    },
    cv: {
        type: String,
    },
    wallet: {
        type: Number,
        default:0
    },
    status:{
        type:String,
        enum: {
            values: ['pending', 'accepted'],
            message: '{VALUE} is not supported'
        }
    }
    
},{timestamps: true}),options)

module.exports = Instructor
const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    rating:{
        type:Number,
        required: true,
    },
    review:{
        type:String,
        required: true,
    },
},{timestamps: true})

module.exports = mongoose.model('Rating', ratingSchema)


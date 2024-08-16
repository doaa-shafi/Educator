const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    country:{
        type:String,
        default:"United States"
    },
    role:{
        type:String,
        enum: {
            values: ['ITrainee', 'CTrainee','instructor','admin','corporate'],
            message: '{VALUE} is not supported'
        }
    }
},{timestamps: true})

module.exports = mongoose.model('User', userSchema)


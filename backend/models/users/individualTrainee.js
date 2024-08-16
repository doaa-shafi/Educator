const mongoose = require('mongoose')
const User = require('./user')
const options = { discriminatorKey: 'kind' };

const IndividualTrainee =User.discriminator('IndividualTrainee' ,new mongoose.Schema({
    wallet:{
        type:Number,
        default:0
    },
    enrollments:[{
        type:mongoose.Types.ObjectId,
        ref:"Enrollment",
    }]
},{timestamps: true}),options)

module.exports =IndividualTrainee


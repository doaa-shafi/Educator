const mongoose = require('mongoose')
const User = require('./user')
const options = { discriminatorKey: 'kind' };

const CorporateTrainee = User.discriminator('CorporateTrainee',new mongoose.Schema({
    courseRequests:[{
        title:{
            type: mongoose.Types.ObjectId,
            ref:'Course'
        },
        status:{
            type:String
        }
    }],
    corporate:{
        type: mongoose.Types.ObjectId,
        ref:'Corporate'
    },
    enrollments:[{
        type:mongoose.Types.ObjectId,
        ref:"Enrollment",
    }]

},{timestamps: true}),options)

module.exports =CorporateTrainee 


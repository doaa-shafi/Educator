const mongoose = require('mongoose')
const User = require('./user')
const options = { discriminatorKey: 'kind' };

const CorporateTrainee = User.discriminator('CorporateTrainee',new mongoose.Schema({
    corporate:{
        type: mongoose.Types.ObjectId,
        ref:'Corporate'
    },
    

},{timestamps: true}),options)

module.exports =CorporateTrainee 


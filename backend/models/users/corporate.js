const mongoose = require('mongoose');
const User = require('./user');
const options = { discriminatorKey: 'kind' };


const Corporate = User.discriminator('Corporate',new mongoose.Schema({
    courses:[{
        id:{
            type: mongoose.Types.ObjectId,
            ref: 'Course',
        },
        title:{
            type:String
        },
        totalEnrollments:{
            type:Number
        },
        currentEnrollments:{
            type:Number
        }
    }],
    plan: {
        type: String,
        enum: ['Standard', 'Premium'],
        required: true,
    },
    // status: {
    //     type: String,
    //     enum: ['Active', 'Pending'],
    // },
    // stripeCustomerId: {
    //     type: String,
    //     required: true,
    // },
    // endDate: {
    //     type: Date,
    //     required: true,
    // },
    // lastPaymentDate: {
    //     type: Date,
    // },

},{timestamps: true}),options)


module.exports = Corporate;
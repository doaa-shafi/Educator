const mongoose = require('mongoose');
const User = require('./user');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    trainees: [{
        type: mongoose.Types.ObjectId,
        ref: 'CorporateTrainee',
    }],
    courses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
}, { _id: false });

const corporateSchema = new mongoose.Schema({
    teams: {
        type: [teamSchema],
        validate: {
            validator: function (teams) {
                return !(this.plan === 'Standard' && teams.length > 1);
            },
            message: 'Standard plan allows only one team.'
        }
    },
    team_size: {
        type: Number,
        default: 0,
    },
    plan: {
        type: String,
        enum: ['Standard', 'Premium'],
        required: true,
    }
}, { timestamps: true });

const Corporate = User.discriminator('Corporate', corporateSchema);

module.exports = Corporate;

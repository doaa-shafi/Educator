const mongoose = require('mongoose');
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
}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema)
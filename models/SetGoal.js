const mongoose = require('mongoose');

const SetGoalSchema = new mongoose.Schema({

    goal: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    },

});

const SetGoal = mongoose.model('SetGoal', SetGoalSchema);

module.exports = SetGoal;

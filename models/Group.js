const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({

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

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;

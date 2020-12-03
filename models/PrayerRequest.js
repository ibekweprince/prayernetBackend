const mongoose = require('mongoose');

const PrayerRequestSchema = new mongoose.Schema({

    PostDes: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

});

const PrayerRequest = mongoose.model('PrayerRequest', PrayerRequestSchema);

module.exports = PrayerRequest;

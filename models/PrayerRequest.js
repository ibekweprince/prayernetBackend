const mongoose = require('mongoose');

const PrayerRequestSchema = new mongoose.Schema({

    prayerRequestDes: {
        type: String,
        required: true
    },
    duration: {
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

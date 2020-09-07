const mongoose = require('mongoose');

const WithdrawBoxSchema = new mongoose.Schema({
    accName: {
        type: String,
        required: true
    },
    accNo: {
        type: String,
        required: true

    },
    bank: {

        type: String,
        required: true
    },
    name: {

        type: String,
        required: true
    },
    phone: {

        type: Number,
        required: true
    },
    myId:{
        type: String,
    },
    amount:{
        type: Number,

    },
    paired:{
        type: [Object],
    }


});

const WithdrawBox = mongoose.model('WithdrawBox', WithdrawBoxSchema);

module.exports = WithdrawBox;

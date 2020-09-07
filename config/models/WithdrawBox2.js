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
    amount2:{
        type: Number,

    },
    paired:{
        type: [Object],
    }


});

const WithdrawBox2 = mongoose.model('WithdrawBox2', WithdrawBoxSchema);

module.exports = WithdrawBox2;

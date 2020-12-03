const mongoose = require('mongoose');

const CreateGroupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    img: {
        type: [Object],
        required: true
    },
    groupUsers: {
        type: [Object],
      },
    userId: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    },

});

const CreateGroup = mongoose.model('CreateGroup', CreateGroupSchema);

module.exports = CreateGroup;

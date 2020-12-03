const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  profileColor: {
    type: String,
  },
  goals: {
    type: [Object],
  },
  posts: {
    type: [Object],
  },
  prayerRequests: {
    type: [Object],
  },
  groups: {
    type: [Object],
  },
  createdGroups: {
    type: [Object],
  },
  date: {
    type: Date,
    default: Date.now
  },

});

const User = mongoose.model('User', UserSchema);

module.exports = User;

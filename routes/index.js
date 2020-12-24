const express = require('express');
const router = express.Router();


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
let userD = ''
// Welcome Page


// home
router.get('/home', (req, res) => {
  userD = req.user
  res.json(userD)
});

module.exports = router;
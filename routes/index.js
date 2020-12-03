const express = require('express');
const router = express.Router();


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
let userD = ''
// Welcome Page
router.get('/', (req, res) => res.render('welcome'));


// Dashboard
router.get('/dashboard', (req, res) => {
  userD = req.user
  res.json(userD)
});

module.exports = router;

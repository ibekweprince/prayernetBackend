const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const SetGoal = require('../models/SetGoal');
const Group = require('../models/Group');

 

// Register
router.post('/register', (req, res) => {
  const { email, password, password2, firstname, lastname, username } = req.body;
  let errors = [];

  if (!email || !password || !password2 || !firstname || !lastname || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.json({
      errors: errors
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.json({
          errors: errors
        });
      } else {

        goals = []
        group = []


        const newUser = new User({
          email,
          password,
          password2,
          firstname,
          lastname,
          username,
          goals,
          group
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.json({
                  user: user
                })
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});



// Set Goals
router.post('/setGoal:user_id ', (req, res) => {
  const { goal, amount } = req.body;

  const user_id = req.query.user_id
  let errors = [];

  if (!goal || !amount) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.json({
      errors: errors
    });
  } else {
    User.findOne({ _id: user_id }).then(user => {

      newGoal = new SetGoal({
        goal,
        amount,
        user_id

      })

      User.updateOne({ _id: user._id }, { $push: { goals: newGoal } },
        function (err, goal) {
          if (err) {
            res.json({
              error: err
            })
          }
          console.log(goal)

        })
      SetGoal
        .save()
        .then(user => {
          res.json(user)
        })
        .catch(err => console.log(err));
    })
  }
});


// join group
router.post('/joinGroup:user_id:group_id', (req, res) => {

  const user_id = req.query.user_id
  const group_id = req.query.group_id

  Group.findOne({ _id: group_id }).then(group => {
    User.updateOne({ _id: user_id }, { $push: { groups: group } },
      function (err, user) {
        if (err) {
          res.json({
            error: err
          })
        }
        console.log(user)
      })
  })

  User.findOne({ _id: user_id }).then(user => {
    Group.updateOne({ _id: group_id }, { $push: { users: user } },
      function (err, group) {
        if (err) {
          res.json({
            error: err
          })
        }
        console.log(group)
      })
  })

});



// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const SetGoal = require('../models/SetGoal');
const Group = require('../models/Group');
const CreateGroup = require('../models/CreateGroup');


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


//change password
router.put("/password/:id", async (req, res) => {
  try {
    const _id = req.params.id
    let { password, password2, old_password } = req.body
    let error = [];

    if (password != password2) {
      error.push({ msg: 'Passwords do not match' });
    }

    if (error) {
      return res.status(400).json({
        error: error
      })
    }

    let data = await UserModel.findOne({ _id })
    if (!data) {
      return res.status(400).json({
        error: "User does not exist in database"
      })
    } else {

      const isValid = await bcrypt.compare(old_password, data.password)
      if (isValid) {
        password = await bcrypt.hash(password, 15)
        const newUser = await UserModel.findOneAndUpdate({ _id }, { password }, { new: true })
        return res.status(201).json(newUser)
      } else {
        return res.status(400).json({
          error: "Incorrect Password"
        })
      }
    }

  } catch (err) {
    console.log(err)

  }

})


// Set Goals
router.post('/setGoal:user_id ', (req, res) => {
  const { goal, amount } = req.body;

  const user_id = req.params.user_id
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


// create group
router.post('/createGroup:user_id', (req, res) => {
  const user_id = req.params.user_id

  const { name, des, img, display } = req.body;
  let errors = [];

  if (!name || !des || !img || !display) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.json({
      errors: errors
    });
  } else {
    CreateGroup.findOne({ name: name }).then(group => {
      if (group) {
        errors.push({ msg: 'name already exists' });
        res.json({
          errors: errors
        });
      } else {

        groupUsers = []

        const newGroup = new CreateGroup({
          name,
          des,
          img,
          display,
          groupUsers,
          user_id
        });

        User.findOne({ _id: user_id }).then(user => {
          User.updateOne({ _id: user.id }, { $push: { createdGroups: newGroup } },
            function (err, group) {
              if (err) {
                res.json({
                  error: err
                })
              }
              console.log(group)
            })
        })

        newGroup
          .save()
          .then(group => {
            req.json({
              group: group
            })
          })
          .catch(err => console.log(err));
      }
    });
  }

});



// join group
router.post('/joinGroup:user_id:group_id', (req, res) => {

  const user_id = req.params.user_id
  const group_id = req.params.group_id

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
    Group.updateOne({ _id: group_id }, { $push: { groupUsers: user } },
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

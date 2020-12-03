const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const SetGoal = require('../models/SetGoal');
const Group = require('../models/Group');
const CreateGroup = require('../models/CreateGroup');
const Post = require('../models/Post');
const PrayerRequest = require('../models/PrayerRequest');


router.get('/login', (req, res) => {
  res.json('login or register')
});

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

        let goals = []
        let groups = []
        let posts = []
        let prayerRequests = []
        let phoneNumber = ''
        let profileColor = ''


        const newUser = new User({
          email,
          password,
          password2,
          firstname,
          lastname,
          username,
          goals,
          groups,
          posts,
          prayerRequests,
          phoneNumber,
          profileColor
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

//complete reg

router.post("/completeReg:id", async (req, res) => {
  try {
    const _id = req.params.id
    const { username, firstname, lastname, phoneNumber, profileColor } = req.body
    const updatedAt = new Date()
    const data = await User.findOneAndUpdate({ _id }, { username, firstname, lastname, phoneNumber, profileColor }, { new: true })

    console.log(req.body)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
  }

})


//change password
router.put("/changePassword/:id", async (req, res) => {
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

    let data = await User.findOne({ _id })
    if (!data) {
      return res.status(400).json({
        error: "User does not exist in database"
      })
    } else {

      const isValid = await bcrypt.compare(old_password, data.password)
      if (isValid) {
        password = await bcrypt.hash(password, 15)
        const newUser = await User.findOneAndUpdate({ _id }, { password }, { new: true })
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

        let groupUsers = []

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



// create Post
router.post('/createPost:user_id', (req, res) => {
  const user_id = req.params.user_id

  const { postDes } = req.body;
  let errors = [];

  if (!postDes) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.json({
      errors: errors
    });
  } else {
    const newPost = new Post({
      postDes
    });

    User.findOne({ _id: user_id }).then(user => {
      User.updateOne({ _id: user.id }, { $push: { posts: postDes } },
        function (err, post) {
          if (err) {
            res.json({
              error: err
            })
          }
          console.log(post)
        })
    })

    Post
      .save()
      .then(post => {
        req.json({
          post
        })
      })
      .catch(err => console.log(err));

  }

});




// create PrayerRequest
router.post('/createPrayerRequest:user_id', (req, res) => {
  const user_id = req.params.user_id

  const { prayerRequestDes, date } = req.body;
  let errors = [];

  if (!date || !prayerRequestDes) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.json({
      errors: errors
    });
  } else {
    const newPrayerRequestDes = new PrayerRequest({
      prayerRequestDes,
      date
    });

    User.findOne({ _id: user_id }).then(user => {
      User.updateOne({ _id: user.id }, { $push: { prayerRequests: newPrayerRequestDes } },
        function (err, prayer) {
          if (err) {
            res.json({
              error: err
            })
          }
          console.log(prayer)
        })
    })
    PrayerRequest
      .save()
      .then(prayer => {
        req.json({
          prayer
        })
      })
      .catch(err => console.log(err));
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

//Get all Users
router.get("/getUsers", async (req, res) => {
  const data = await User.find({})
  res.status(200).json({
    data
  })

})

//Get all Group
router.get("/getGroup", async (req, res) => {
  const data = await CreateGroup.find({})
  res.status(200).json({
    data
  })

})

//Get all Prayer
router.get("/getPrayer", async (req, res) => {
  const data = await PrayerRequest.find({})
  res.status(200).json({
    data
  })

})

//Get all Post
router.get("/getPost", async (req, res) => {
  const data = await Post.find({})
  res.status(200).json({
    data
  })

})



module.exports = router;

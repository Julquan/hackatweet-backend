var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcryptjs');
const { checkBody } = require('../modules/checkBody');

//user signup
router.post('/signup', function(req, res) {
  let { firstname, username, password } = req.body

  if(!firstname || !username || !password) {
    res.json({ result: false, message: 'Missing or empty fields.' });
    return;
  }

  User.findOne({username})
  .then(user => {
    const token = uid2(32);
    const hash = bcrypt.hashSync(password, 10);
    if(!user) {
      const newUser = new User({
        firstname,
        username,
        password: hash,
        token,
      });
      newUser.save().then(newEntry => {
        res.json({ result: true, user: newEntry })
      });
    } else {
      res.json({ result: false, message: 'User already exists.'})
    }
  });
});

//user signin 
router.post('/signin', function(req, res){
  if(!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields.'});
    return;
  }
  User.findOne({username:req.body.username}).then(data => {
    if(data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({result:true, token: data.token});
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

module.exports = router;

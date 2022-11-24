var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcryptjs');
const { checkBody } = require('../modules/checkBody');

//user signup
router.post('/signup', function(req, res) {
  let { firstname, username, password, token } = req.body

  if(!firstname || !username || !password || !token) {
    res.json({result: false, message: 'Missing or empty fields.'});
    return;
  }

  User.findOne({username})
  .then(data => {
    console.log(data)
  })
})

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
  })
})
module.exports = router;

var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcryptjs');
const { checkBody } = require('../modules/checkBody');

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});



//for user sign in 
router.post('/signin', function(req, res){
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields'});
    return
  }
  User.findOne({username:req.body.username}).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)){
      res.json({result:true, token: data.token});
    }else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})
module.exports = router;

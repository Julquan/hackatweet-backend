const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    firstname: String,  
    username: String,
    time: Date,
    content: String,
    hashtag: Array,
    deleted: {type: Boolean, default: false},
  });

  const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;
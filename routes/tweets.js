var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets')
const User = require('../models/users')

//create / store tweet to database and return all tweets available
router.post('/post', (req, res) => {
    let { token, content } = req.body;

    if (!content) {
        res.json({ result: false, message: 'No tweet submitted.' });
        return;
    }

    User.findOne({token})
    .then(data => {
        let { firstname, username } = data;

        const pattern = /#.\S*/gi;
        const newTweet = new Tweet({
            firstname,
            username,
            time: Date(),
            content,
            hashtag: content.match(pattern),
        });

        newTweet.save().then(() => {
            Tweet.find().then(tweets => {
                res.json({
                    result: true,
                    message: 'New tweet created.',
                    tweets,
                });
            });
        });
    })
});

//get all tweets
router.get('/', (req, res) => {
    Tweet.find().then(tweets => {
        if(tweets.length > 0) {
            res.json({result: true, tweets})
        } else {
            res.json({result: false, message: "No tweets created yet."})
        }
    })
})

//get tweets with an specific hashtag
router.get('/search/:hashtag', (req, res) => { 
    const { hashtag } = req.params; 
    Tweet.find({ hashtag: { $all: [`${hashtag}`]}})
    .then( data => { 
        res.json(data) }
    )    
}) 

router.post('/delete', (req, res) => {
    let {token, username, content} = req.body;
    Tweet.updateOne(
        {
        username,
        content,
        token
        },
        { is_deleted: true }
    ).then(deleted => 
        
        res.json({deleted}))
})
        
module.exports = router;
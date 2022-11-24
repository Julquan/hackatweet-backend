var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets')

//create / store tweet to database and return all tweets available
router.post('/post', (req, res) => {

    //to be modified: firstname and username from user token '/tweet/:token'

    let { firstname, username, content } = req.body;

    if (!content) {
        res.json({ result: false, message: 'No tweet submitted.' });
        return;
    }

    Tweet.find().then(data => {
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
    });
});

//get tweets with an specific hashtag
    router.get('/search/:hashtag', (req, res) => { 
        const {hashtag} = req.params; 
        // console.log(hashtag)
        Tweet.find({ hashtag: { $all: [`${hashtag}`]}}).then( data => { 
            res.json(data) }
        )    
    }) 
        
    




module.exports = router;
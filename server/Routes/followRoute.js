const express = require("express");
const router = express.Router();
const followController = require('../Controllers/followController');
    
router.route('/').post(followController.postFollow);
router.route('/:username').get(followController.getFollows);
router.route('/:username/:email_follower/').get(followController.VerificarFollow);
router.route('/').delete(followController.deleteFollow);

module.exports = router;
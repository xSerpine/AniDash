const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const followsController = require('../Controllers/followsController');
    
router.route('/').post(auth, followsController.postFollow);
router.route('/:username').get(followsController.getFollows);
router.route('/:username/:id_follower/').get(followsController.checkFollow);
router.route('/').delete(auth, followsController.deleteFollow);

module.exports = router;
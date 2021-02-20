const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const followsController = require('../Controllers/followsController');
    
router.route('/').post(auth, followsController.postFollow);
router.route('/:username').get(auth, followsController.getFollows);
router.route('/:username/:id_follower/').get(auth, followsController.checkFollow);
router.route('/').delete(auth, followsController.deleteFollow);

module.exports = router;
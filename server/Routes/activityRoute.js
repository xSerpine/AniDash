const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const activityController = require('../Controllers/activityController');
    
router.route('/').post(auth, activityController.postActivity);
router.route('/:id').get(auth, activityController.getActivity);

module.exports = router;
const express = require('express');
const router = express.Router();
const activityController = require('../Controllers/activityController');
    
router.route('/').post(activityController.postActivity);
router.route('/:username').get(activityController.getActivity);

module.exports = router;
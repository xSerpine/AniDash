const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const usersController = require('../Controllers/usersController');
    
router.route('/').post(usersController.postRegister);
router.route('/recover').post(usersController.postRecoverMethod);
router.route('/confirm').put(usersController.putVerifiedUser);
router.route('/recover').put(usersController.putPasswordUser);
router.route('/profile').put(auth, usersController.putProfile);
router.route('/:username').get(auth, usersController.getUser);
router.route('/search/:query').get(auth, usersController.getUsers);
router.route('/stats/:username').get(auth, usersController.getStats);

module.exports = router;
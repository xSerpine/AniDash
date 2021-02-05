const express = require('express');
const router = express.Router();
const usersController = require('../Controllers/usersController');
    
router.route('/').post(usersController.postRegister);
router.route('/recover').post(usersController.postRecoverMethod);
router.route('/').put(usersController.putAvatar);
router.route('/confirm').put(usersController.putVerifiedUser);
router.route('/recover').put(usersController.putPasswordUser);
router.route('/:user').get(usersController.getUser);
router.route('/search/:query').get(usersController.getUsers);
router.route('/stats/:user').get(usersController.getStats);

module.exports = router;
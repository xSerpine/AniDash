const express = require("express");
const router = express.Router();
const usersController = require('../Controllers/usersController');
    
router.route('/').post(usersController.postRegister);
router.route('/').put(usersController.putAvatar);
router.route('/:user').get(usersController.getUser);
router.route('/search/:search_query').get(usersController.getUsers);
router.route('/postsperpage').put(usersController.putPostsPerPage);

module.exports = router;
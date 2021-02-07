const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const authController = require('../Controllers/authController');
    
router.route('/login').post(authController.postLogin);
router.route('/verify').get(auth, authController.getVerificar);

module.exports = router;
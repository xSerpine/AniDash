const express = require("express");
const router = express.Router();
const autorizar = require("../Middleware/autorizar");
const autenticacaoController = require('../Controllers/autenticacaoController');
    
router.route('/login').post(autenticacaoController.postLogin);
router.route('/verificar').get(autorizar, autenticacaoController.getVerificar);

module.exports = router;
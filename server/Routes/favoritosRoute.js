const express = require("express");
const router = express.Router();
const favoritosController = require('../Controllers/favoritosController');

router.route('/anime').post(favoritosController.postFavoritoAnime);
router.route('/manga').post(favoritosController.postFavoritoManga);
router.route('/:user/:type').get(favoritosController.getFavoritos);
router.route('/ongoing/:email/:type').get(favoritosController.getFavoritosOnGoing);
router.route('/finished/:email/:type').get(favoritosController.getFavoritosFinished);
router.route('/:email/:id/:type').get(favoritosController.VerificarFavoritos);
router.route('/:email/:id/:type').delete(favoritosController.DeleteFavorito);

module.exports = router;
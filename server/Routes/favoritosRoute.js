const express = require('express');
const router = express.Router();
const favoritosController = require('../Controllers/favoritosController');

router.route('/anime').post(favoritosController.postFavoriteAnime);
router.route('/manga').post(favoritosController.postFavoriteManga);
router.route('/favorite/:user/:id/:type').get(favoritosController.getFavorite);
router.route('/:user/:type').get(favoritosController.getFavorites);
router.route('/ongoing/:email/:type').get(favoritosController.getFavoritesOnGoing);
router.route('/finished/:email/:type').get(favoritosController.getFavoritesFinished);
router.route('/progress/:email/:type/:progress').get(favoritosController.getFavoritesProgress);
router.route('/:email/:id/:type').get(favoritosController.checkFavorites);
router.route('/counter').put(favoritosController.putFavoritosEpisodesChapters);
router.route('/progress').put(favoritosController.putFavoritosProgress);
router.route('/:email/:id/:type').delete(favoritosController.deleteFavorite);

module.exports = router;
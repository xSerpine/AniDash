const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const favoritesController = require('../Controllers/favoritesController');

router.route('/anime').post(auth, favoritesController.postFavoriteAnime);
router.route('/manga').post(auth, favoritesController.postFavoriteManga);
router.route('/favorite/:id/:id_content/:type').get(auth, favoritesController.getFavorite);
router.route('/:id/:type').get(auth, favoritesController.getFavorites);
router.route('/ongoing/:id/:type').get(auth, favoritesController.getFavoritesOnGoing);
router.route('/finished/:id/:type').get(auth, favoritesController.getFavoritesFinished);
router.route('/progress/:id/:type/:progress').get(auth, favoritesController.getFavoritesProgress);
router.route('/:id/:id_content/:type').get(auth, favoritesController.checkFavorites);
router.route('/counter').put(auth, favoritesController.putFavoritosEpisodesChapters);
router.route('/progress').put(auth, favoritesController.putFavoritosProgress);
router.route('/:id/:id_content/:type').delete(auth, favoritesController.deleteFavorite);

module.exports = router;
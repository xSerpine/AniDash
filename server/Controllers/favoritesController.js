const fetch = require('node-fetch');
const pool = require('../db');

module.exports = {
    postFavoriteAnime : async(req, res) => {
        try { 
            const { id, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE _id = $1', [id]);

            await pool.query(
                'INSERT INTO animefavorites (id_user, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                [id, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [id, user.rows[0].username, 'anime', 'added', id_anime, name]
            );

            res.status(200).send('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    postFavoriteManga : async(req, res) => {
        try { 
            const { id, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE _id = $1', [id]);

            await pool.query(
                'INSERT INTO mangafavorites (id_user, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
                [id, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [id, user.rows[0].username, 'manga', 'added', id_manga, name]
            );
  
            res.status(200).send('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavorite : async(req, res) => {
        try{
            const { id, id_content, type } = req.params;

            const favoritos = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND id_${type} = $2
            `, [id, id_content]);

            if(favoritos.rows.length === 0) return res.status(404).send(`Couldn't find ${type}.`);

            res.json(favoritos.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavorites : async(req, res) => {
        try{
            const { id, type } = req.params;
            const page = req.query.page;

            const favoritos = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1
                ORDER BY name ASC
                ${page ? `LIMIT 20 OFFSET (${page} - 1) * 20` : ''}
            `, [id]);

            res.json(favoritos.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesOnGoing : async(req, res) => {
        try{
            const { id, type } = req.params;
            const page = req.query.page;

            let status;
            if(type == 'anime') status = 'Currently Airing';
            else status = 'Publishing';

            const ongoingFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND status = $2
                ORDER BY name ASC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [id, status]);

            res.json(ongoingFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesFinished : async(req, res) => {
        let status;

        try{
            const { id, type } = req.params;
            const page = req.query.page;

            if(type == 'anime') status = 'Finished Airing';
            else status = 'Finished';

            const finishedFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND status = $2
                ORDER BY name ASC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [id, status]);

            res.json(finishedFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesProgress : async(req, res) => {
        try{
            const { progress, id, type } = req.params;
            const page = req.query.page;

            const progressFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND progress = $2
                ORDER BY name ASC
                LIMIT 50 OFFSET (${page} - 1) * 50
            `, [id, progress]);

            res.json(progressFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    checkFavorites : async(req, res) => {
        try{
            const { id, id_content, type } = req.params;

            const favorites = await pool.query(`
                SELECT * FROM ${type}favorites WHERE id_user = $1
            `, [id]);

            if(type == 'anime') {
                const animeExists = favorites.rows.some(favorite => (favorite.id_anime == id_content));
                if(animeExists) return res.json(true);
            }
            if(type == 'manga') {
                const mangaExists = favorites.rows.some(favorite => (favorite.id_manga == id_content));
                if(mangaExists) return res.json(true);
            }

            res.json(false);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putFavoritosEpisodesChapters : async(req, res) => {
        try{
            const { count, completed, id, id_content, type } = req.body;

            if(type == 'anime' && !isNaN(count)) {
                await pool.query(`
                    UPDATE animefavorites 
                    SET watched = ${count} ${completed ? ", progress = 'completed'" : ", progress = 'watching'"}
                    WHERE id_user = $1 AND id_anime = $2
                `,[id, id_content]);

                return res.status(200).send('OK');
            }
            if(type == 'manga' && !isNaN(count)) {
                await pool.query(`
                    UPDATE mangafavorites 
                    SET read = ${count} ${completed ? ", progress = 'completed'" : ", progress = 'reading'"}
                    WHERE id_user = $1 AND id_manga = $2
                `,[id, id_content]);

                return res.status(200).send('OK');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putFavoritosProgress : async(req, res) => {
        try{
            const { progress, id, id_content, type } = req.body;

            const resJikan = await fetch(`https://api.jikan.moe/v3/${type}/${id_content}`);
            const content = await resJikan.json();

            if(type == 'anime' && progress) {
                await pool.query(`
                    UPDATE animefavorites 
                    SET progress = '${progress}' ${progress === 'completed' ? `, watched = ${content.episodes}` : ''} 
                    WHERE id_user = $1 AND id_anime = $2
                `,[id, id_content]);                

                return res.status(200).send('OK');
            }
            if(type == 'manga' && progress) {
                await pool.query(`
                    UPDATE mangafavorites 
                    SET progress = '${progress}' ${progress === 'completed' ? `, read = ${content.chapters}` : ''} 
                    WHERE id_user = $1 AND id_manga = $2
                `,[id, id_content]);

                return res.status(200).send('OK');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    deleteFavorite : async(req, res) => {
        try{
            const { id, id_content, type } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE _id = $1', [id]);

            const favorite = await pool.query(
                `SELECT * FROM ${type}favorites WHERE id_user = $1 AND id_${type} = $2`, 
                [id, id_content]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [id, user.rows[0].username, type, 'removed', id_content, favorite.rows[0].name]
            );

            await pool.query(
                `DELETE FROM ${type}favorites where id_user = $1 and id_${type} = $2`, 
                [id, id_content]
            );
            
            res.status(200).send('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }
}
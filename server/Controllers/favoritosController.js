const fetch = require('node-fetch');
const pool = require('../db');

module.exports = {
    postFavoriteAnime : async function(req, res){
        const { email, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis } = req.body;

        try { 
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            await pool.query(
                'INSERT INTO animefavorites (id_user, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                [user.rows[0]._id, id_anime, type_anime, name, image, episodes, status, airing_start, broadcast, score, url, synopsis]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [user.rows[0]._id, user.rows[0].username, 'anime', 'added', id_anime, name]
            );

            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    postFavoriteManga : async function(req, res){
        const { email, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis } = req.body;

        try { 
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            await pool.query(
                'INSERT INTO mangafavorites (id_user, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
                [user.rows[0]._id, id_manga, type_manga, name, image, chapters, volumes, status, score, url, synopsis]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [user.rows[0]._id, user.rows[0].username, 'manga', 'added', id_manga, name]
            );
  
            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavorite : async function(req, res){
        let users;

        try{
            const { id, user, type } = req.params;

            if(user.includes('@')) users = await pool.query('SELECT * FROM users WHERE email = $1', [user]);  
            else users = await pool.query('SELECT * FROM users WHERE username = $1', [user]);

            const favoritos = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND id_${type} = $2
            `, [users.rows[0]._id, id]);

            res.json(favoritos.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavorites : async function(req, res){
        let users;

        try{
            const { user, type } = req.params;
            const page = req.query.page;

            if(user.includes('@')) users = await pool.query('SELECT * FROM users WHERE email = $1', [user]);  
            else users = await pool.query('SELECT * FROM users WHERE username = $1', [user]);

            const favoritos = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1
                ORDER BY name ASC
                ${page ? `LIMIT 20 OFFSET (${page} - 1) * 20` : ''}
            `, [users.rows[0]._id]);

            res.json(favoritos.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesOnGoing : async function(req, res){
        let status;

        try{
            const { email, type } = req.params;
            const page = req.query.page;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if(type == 'anime') status = 'Currently Airing';
            else status = 'Publishing';

            const ongoingFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND status = $2
                ORDER BY name ASC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [user.rows[0]._id, status]);

            res.json(ongoingFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesFinished : async function(req, res){
        let status;

        try{
            const { email, type } = req.params;
            const page = req.query.page;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if(type == 'anime') status = 'Finished Airing';
            else status = 'Finished';

            const finishedFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND status = $2
                ORDER BY name ASC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [user.rows[0]._id, status]);

            res.json(finishedFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFavoritesProgress : async function(req, res){
        try{
            const { progress, email, type } = req.params;
            const page = req.query.page;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            const progressFavorites = await pool.query(`
                SELECT * FROM ${type}favorites 
                WHERE id_user = $1 AND progress = $2
                ORDER BY name ASC
                LIMIT 50 OFFSET (${page} - 1) * 50
            `, [user.rows[0]._id, progress]);

            res.json(progressFavorites.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    checkFavorites : async function(req, res){
        let animeExists, mangaExists;

        try{
            const { email, id, type } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            const favorites = await pool.query(
                `SELECT * FROM ${type}favorites WHERE id_user = $1`, 
                [user.rows[0]._id]
            );

            if(type == 'anime') {
                animeExists = favorites.rows.some(favorite => (favorite.id_anime == id));
                if(animeExists) return res.json(true);
            }
            if(type == 'manga') {
                mangaExists = favorites.rows.some(favorite => (favorite.id_manga == id));
                if(mangaExists) return res.json(true);
            }

            res.json(false);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putFavoritosEpisodesChapters : async function(req, res){
        try{
            const { count, completed, email, id, type } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if(type == 'anime' && !isNaN(count)) {
                await pool.query(`
                    UPDATE animefavorites 
                    SET watched = ${count} ${completed ? ", progress = 'completed'" : ", progress = 'watching'"}
                    WHERE id_user = $1 AND id_anime = $2
                `,[user.rows[0]._id, id]);

                return res.json('OK');
            }
            if(type == 'manga' && !isNaN(count)) {
                await pool.query(`
                    UPDATE mangafavorites 
                    SET read = ${count} ${completed ? ", progress = 'completed'" : ", progress = 'reading'"}
                    WHERE id_user = $1 AND id_manga = $2
                `,[user.rows[0]._id, id]);

                return res.json('OK');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putFavoritosProgress : async function(req, res){
        try{
            const { progress, email, id, type } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            const resJikan = await fetch(`https://api.jikan.moe/v3/${type}/${id}`);
            const content = await resJikan.json();

            if(type == 'anime' && progress) {
                await pool.query(`
                    UPDATE animefavorites 
                    SET progress = '${progress}' ${progress === 'completed' ? `, watched = ${content.episodes}` : ''} 
                    WHERE id_user = $1 AND id_anime = $2
                `,[user.rows[0]._id, id]);                

                return res.json('OK');
            }
            if(type == 'manga' && progress) {
                await pool.query(`
                    UPDATE mangafavorites 
                    SET progress = '${progress}' ${progress === 'completed' ? `, read = ${content.chapters}` : ''} 
                    WHERE id_user = $1 AND id_manga = $2
                `,[user.rows[0]._id, id]);

                return res.json('OK');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    deleteFavorite : async function(req, res){
        try{
            const { email, id, type } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            const favorito = await pool.query(
                `SELECT * FROM ${type}favorites WHERE id_user = $1 AND id_${type} = $2`, 
                [user.rows[0]._id, id]
            );

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, id_content, content) VALUES ($1,$2,$3,$4,$5,$6)', 
                [user.rows[0]._id, user.rows[0].username, type, 'removed', id, favorito.rows[0].name]
            );

            await pool.query(
                `DELETE FROM ${type}favorites where id_user = $1 and id_${type} = $2`, 
                [user.rows[0]._id, id]
            );
            
            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }
}
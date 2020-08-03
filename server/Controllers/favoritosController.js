const pool = require("../db");

module.exports = {
    postFavoritoAnime : async function(req, res){
        const { email, id_anime, type_anime, nome, image, episodes, status, airing_start, broadcast, score, url, synopsis } = req.body;

        try { 
            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            await pool.query(
                "INSERT INTO favoritos_anime (id_utilizador, id_anime, type_anime, nome, image, episodes, status, airing_start, broadcast, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
                [user.rows[0].id_utilizador, id_anime, type_anime, nome, image, episodes, status, airing_start, broadcast, score, url, synopsis]
            );

            await pool.query(
                "insert into activity (id_utilizador, username, type_content, action, id_content, content) values ($1,$2,$3,$4,$5,$6)", [user.rows[0].id_utilizador, user.rows[0].username, "anime", "added", id_anime, nome]
            );

  
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    postFavoritoManga : async function(req, res){
        const { email, id_manga, type_manga, nome, image, chapters, volumes, status, score, url, synopsis } = req.body;

        try { 
            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            await pool.query(
                "INSERT INTO favoritos_manga (id_utilizador, id_manga, type_manga, nome, image, chapters, volumes, status, score, url, synopsis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
                [user.rows[0].id_utilizador, id_manga, type_manga, nome, image, chapters, volumes, status, score, url, synopsis]
            );

            await pool.query(
                "insert into activity (id_utilizador, username, type_content, action, id_content, content) values ($1,$2,$3,$4,$5,$6)", [user.rows[0].id_utilizador, user.rows[0].username, "manga", "added", id_manga, nome]
            );
  
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getFavoritos : async function(req, res){
        let users;

        try{
            const { user, type } = req.params;

            if(user.includes("@"))
                users = await pool.query("SELECT * FROM utilizadores WHERE email = $1", [user]);  
            else 
                users = await pool.query("SELECT * FROM utilizadores WHERE username = $1", [user]);

            const favoritos = await pool.query(`
                select * from favoritos_${type} 
                where id_utilizador = $1
                `, [users.rows[0].id_utilizador]
            );

            res.json(favoritos.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getFavoritosOnGoing : async function(req, res){
        let status;

        try{
            const { email, type } = req.params;

            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            if(type == "anime")
                status = "Currently Airing";
            else 
                status = "Publishing";

            const favoritos = await pool.query(
                `select * from favoritos_${type} where id_utilizador = $1 and status = $2`, [user.rows[0].id_utilizador, status]
            );

            res.json(favoritos.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getFavoritosFinished : async function(req, res){
        let status;

        try{
            const { email, type } = req.params;

            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            if(type == "anime")
                status = "Finished Airing";
            else 
                status = "Finished";

            const favoritos = await pool.query(
                `select * from favoritos_${type} where id_utilizador = $1 and status = $2`, [user.rows[0].id_utilizador, status]
            );

            res.json(favoritos.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    VerificarFavoritos : async function(req, res){
        let existe_favorito_anime, existe_favorito_manga;

        try{
            const { email, id, type } = req.params;

            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            const favoritos_dup = await pool.query(
                `select * from favoritos_${type} where id_utilizador = $1`, [user.rows[0].id_utilizador]
            );

            if(type == "anime") {
                existe_favorito_anime = favoritos_dup.rows.map(fav => (fav.id_anime == id));
                if(existe_favorito_anime.includes(true)) return res.json(true);
            }
            if(type == "manga") {
                existe_favorito_manga = favoritos_dup.rows.map(fav => (fav.id_manga == id));
                if(existe_favorito_manga.includes(true)) return res.json(true);
            }

            res.json(false);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    DeleteFavorito : async function(req, res){
        try{
            const { email, id, type } = req.params;

            const user = await pool.query(
                "select * from utilizadores where email = $1", [email]
            );

            const favorito = await pool.query(
                `select * from favoritos_${type} where id_utilizador = $1 and id_${type} = $2`, [user.rows[0].id_utilizador, id]
            );

            await pool.query(
                "insert into activity (id_utilizador, username, type_content, action, id_content, content) values ($1,$2,$3,$4,$5,$6)", [user.rows[0].id_utilizador, user.rows[0].username, type, "removed", id, favorito.rows[0].nome]
            );

            await pool.query(
                `delete from favoritos_${type} where id_utilizador = $1 and id_${type} = $2`, [user.rows[0].id_utilizador, id]
            );
            
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    }
}
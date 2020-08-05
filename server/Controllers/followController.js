const pool = require("../db");

module.exports = {
    postFollow : async function(req, res){
        try { 
            const { id_utilizador, email_follower } = req.body;

            const user = await pool.query(
                "select id_utilizador from utilizadores where email = $1", [email_follower]
            )
                
            await pool.query(
                "INSERT INTO follows (id_utilizador, id_follower) VALUES ($1,$2) RETURNING *",
                [id_utilizador, user.rows[0].id_utilizador]
            );
  
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getFollows : async function(req, res){
        let all_followers_ids = [], all_following_ids = [], info_followers, info_following, contagem_followers, contagem_following;
        
        try { 
            const { username } = req.params;

            const user = await pool.query("select id_utilizador from utilizadores where username = $1", [username]);
               
            //Encontra todos os utilizadores seguidos pelo 'username'
            const user_following = await pool.query("select id_utilizador from follows where id_follower = $1", [user.rows[0].id_utilizador]);
            //Se existirem, os seus IDs são mapeados para um array auxiliar e são guardadas as suas informação numa variável auxiliar
            if(user_following.rows.length > 0) {
                user_following.rows.map(user_fol => (
                    all_following_ids.push(user_fol.id_utilizador)
                ));

                const following = await pool.query(`SELECT * FROM utilizadores WHERE id_utilizador IN (${all_following_ids.join(",")})`);
                info_following = following.rows;
            }
            else info_following = []

            //Encontra todos os utilizadores que seguem o 'username'
            const user_followers = await pool.query("select id_follower from follows where id_utilizador = $1", [user.rows[0].id_utilizador]);
            //Se existirem, os seus IDs são mapeados para um array auxiliar e são guardadas as suas informação numa variável auxiliar
            if(user_followers.rows.length > 0) {
                user_followers.rows.map(user_fol => (
                    all_followers_ids.push(user_fol.id_follower)
                ));

                const followers = await pool.query(`SELECT * FROM utilizadores WHERE id_utilizador IN (${all_followers_ids.join(",")})`);
                info_followers = followers.rows;
            }
            else info_followers = []

            //Recebemos a contagem dos seguidores
            const countFollowers = await pool.query("select count(id_follower) as followers from follows where id_utilizador = $1", [user.rows[0].id_utilizador]);
            contagem_followers = countFollowers.rows[0];
            //Recebemos a contagem dos que o 'username' segue
            const countFollowing = await pool.query("select count(id_utilizador) as followers from follows where id_follower = $1", [user.rows[0].id_utilizador]);
            contagem_following = countFollowing.rows[0];

            res.json({contagem_followers, contagem_following, info_followers, info_following});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    VerificarFollow : async function(req, res){
        try{
            const { username, email_follower } = req.params;

            const user = await pool.query(
                "select id_utilizador from utilizadores where username = $1", [username]
            );

            const user_follower = await pool.query(
                "select id_utilizador from utilizadores where email = $1", [email_follower]
            );

            const follow_dup = await pool.query(
                "select * from follows where id_utilizador = $1 and id_follower = $2", [user.rows[0].id_utilizador, user_follower.rows[0].id_utilizador]
            );

            if(follow_dup.rows.length == 0) return res.json(true);
      
            res.json(false);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    deleteFollow : async function(req, res){
        try{
            const { id_utilizador, email_follower } = req.body;

            const user = await pool.query(
                "select id_utilizador from utilizadores where email = $1", [email_follower]
            )

            await pool.query(
                "delete from follows where id_utilizador = $1 and id_follower = $2", [id_utilizador, user.rows[0].id_utilizador]
            ); 

            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    }   
}
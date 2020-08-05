const pool = require("../db");

module.exports = {
    postActivity : async function(req, res){
        try {
            const { username, comentario } = req.body;

            const user = await pool.query(
                "select id_utilizador from utilizadores where username = $1", [username]
            );

            await pool.query("insert into activity (id_utilizador, username, type_content, action, content) values ($1,$2,$3,$4,$5)", [user.rows[0].id_utilizador, username, "comentario", "comment", comentario])
            
            return res.json("OK")
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getActivity : async function(req, res){
        let following_ids = [], following_activity_ids = [];

        try {
            const { username } = req.params;
            const page = req.query.page;

            const user = await pool.query("select id_utilizador from utilizadores where username = $1", [username]);
               
            //Encontrar utilizadores que o utilizador 'username' segue
            const user_following = await pool.query("select * from follows where id_follower = $1", [user.rows[0].id_utilizador]);

            //Se não seguir ninguém, trata de devolver a atividade relativa aos seus próprios posts
            if(user_following.rows.length === 0) {
                const user_posts = await pool.query(`
                    select * from activity
                    where id_utilizador = $1 
                        and action = 'comment'
                    order by hora desc
                    limit 20 OFFSET (${page} - 1) * 20
                `, [user.rows[0].id_utilizador]);
                return res.json(user_posts.rows);    
            }

            //Caso siga alguém, os IDs desse(s) utilizador(es) são mapeados para um array auxiliar
            user_following.rows.map(user_fol => (
                following_ids.push(user_fol.id_utilizador)
            ));

            //Encontrar activity associada aos IDs dos utilizadores no array auxiliar
            const users = await pool.query(`select * from activity where id_utilizador in (${following_ids.join(",")})`);

            //Se não encontrar nenhuma activity, sai
            if(users.rows.length === 0) return res.json(false);

            //Caso exista alguma activity, os IDs dos utilizadores com activity são mapeados para um segundo array auxiliar
            users.rows.map(user_fol => (
                following_activity_ids.push(user_fol.id_utilizador)
            ));

            //Encontra toda a activity associado os utilizadores no segundo array
            const activity = await pool.query(`
                select * from activity 
                where id_utilizador in (${following_activity_ids.join(",")}) 
                union
                select * from activity
                where id_utilizador = $1 
                    and action = 'comment'
                order by hora desc
                limit 20 OFFSET (${page} - 1) * 20
            `, [user.rows[0].id_utilizador]);

            return res.json(activity.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    }
}
const pool = require('../db');

module.exports = {
    postActivity : async function(req, res){
        try {
            const { username, status } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, content) VALUES ($1,$2,$3,$4,$5)', 
                [user.rows[0]._id, username, 'comentario', 'comment', status]
            )
            
            return res.json('OK')
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getActivity : async function(req, res){
        let followingUserIDs = [], followingActivityIDs = [];

        try {
            const { username } = req.params;
            const page = req.query.page;

            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const userFollowing = await pool.query('SELECT * FROM follows WHERE id_follower = $1', [user.rows[0]._id]);

            if(userFollowing.rows.length === 0) {
                const userPosts = await pool.query(`
                    SELECT * FROM activity
                    WHERE id_user = $1 AND action = 'comment'
                    ORDER BY hour DESC
                    LIMIT 20 OFFSET (${page} - 1) * 20
                `, [user.rows[0]._id]);
                return res.json(userPosts.rows);    
            }

            if(userFollowing.rows.length > 0) {
                userFollowing.rows.map(userFol => (
                    followingUserIDs.push(userFol.id_user)
                ));
    
                const users = await pool.query(`SELECT * FROM activity WHERE id_user IN (${followingUserIDs.join(',')})`);
                if(users.rows.length > 0) {
                    users.rows.map(userFol => (
                        followingActivityIDs.push(userFol.id_user)
                    ));

                    const activity = await pool.query(`
                        SELECT * FROM activity 
                        WHERE id_user IN (${followingActivityIDs.join(',')}) 
                        UNION
                        SELECT * FROM activity
                        WHERE id_user = $1 AND action = 'comment'
                        ORDER BY hour DESC
                        LIMIT 20 OFFSET (${page} - 1) * 20
                    `, [user.rows[0]._id]);

                    return res.json(activity.rows);
                }
            }

            const userPosts = await pool.query(`
                SELECT * FROM activity
                WHERE id_user = $1 AND action = 'comment'
                ORDER BY hour DESC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [user.rows[0]._id]);
            
            return res.json(userPosts.rows); 
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }
}
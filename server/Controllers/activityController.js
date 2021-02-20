const pool = require('../db');

module.exports = {
    postActivity : async(req, res) => {
        try {
            const { id, status } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE _id = $1', [id]);

            await pool.query(
                'INSERT INTO activity (id_user, username, type_content, action, content) VALUES ($1,$2,$3,$4,$5)', 
                [id, user.rows[0].username, 'comentario', 'comment', status]
            )
            
            res.status(200).send('OK');
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getActivity : async(req, res) => {
        let followingUserIDs = [], followingActivityIDs = [];

        try {
            const { id } = req.params;
            const page = req.query.page;

            const userFollowing = await pool.query('SELECT * FROM follows WHERE id_follower = $1', [id]);

            if(userFollowing.rows.length === 0) {
                const userPosts = await pool.query(`
                    SELECT * FROM activity
                    WHERE id_user = $1 AND action = 'comment'
                    ORDER BY hour DESC
                    LIMIT 20 OFFSET (${page} - 1) * 20
                `, [id]);
                return res.json(userPosts.rows);    
            }

            if(userFollowing.rows.length > 0) {
                userFollowing.rows.map(user => (
                    followingUserIDs.push(`'${user.id_user}'`)
                ));
    
                const users = await pool.query(`SELECT * FROM activity WHERE id_user IN (${followingUserIDs.join(',')})`);
                if(users.rows.length > 0) {
                    users.rows.map(user => (
                        followingActivityIDs.push(`'${user.id_user}'`)
                    ));

                    const activity = await pool.query(`
                        SELECT * FROM activity 
                        WHERE id_user IN (${followingActivityIDs.join(',')}) 
                        UNION
                        SELECT * FROM activity
                        WHERE id_user = $1 AND action = 'comment'
                        ORDER BY hour DESC
                        LIMIT 20 OFFSET (${page} - 1) * 20
                    `, [id]);

                    return res.json(activity.rows);
                }
            }

            const userPosts = await pool.query(`
                SELECT * FROM activity
                WHERE id_user = $1 AND action = 'comment'
                ORDER BY hour DESC
                LIMIT 20 OFFSET (${page} - 1) * 20
            `, [id]);
            
            return res.json(userPosts.rows); 
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }
}
const pool = require('../db');

module.exports = {
    postFollow : async(req, res) => {
        try { 
            const { id, id_follower } = req.body;
                
            await pool.query(
                'INSERT INTO follows (id_user, id_follower) VALUES ($1,$2)',
                [id, id_follower]
            );
  
            res.status(200).send('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getFollows : async(req, res) => {
        let followersIDs = [], followingIDs = [], followers, following;
        
        try { 
            const { username } = req.params;
            const page = req.query.page;

            const user = await pool.query(`
                SELECT _id FROM users WHERE username = $1
            `, [username]);
               
            const userFollowing = await pool.query(`
                SELECT id_user FROM follows 
                WHERE id_follower = $1
            `, [user.rows[0]._id]);
            if(userFollowing.rows.length > 0) {
                userFollowing.rows.map(user => (
                    followingIDs.push(`'${user.id_user}'`)
                ));

                const followingList = await pool.query(`
                    SELECT * FROM users 
                    WHERE _id IN (${followingIDs.join(',')})
                    ${page ? `LIMIT 20 OFFSET (${page} - 1) * 20` : ''}
                `);
                following = followingList.rows;
            }
            else following = [];

            const userFollowers = await pool.query(`
                SELECT id_follower FROM follows 
                WHERE id_user = $1
            `, [user.rows[0]._id]);
            if(userFollowers.rows.length > 0) {
                userFollowers.rows.map(user => (
                    followersIDs.push(`'${user.id_follower}'`)
                ));

                const followersList = await pool.query(`
                    SELECT * FROM users 
                    WHERE _id IN (${followersIDs.join(',')})
                    ${page ? `LIMIT 20 OFFSET (${page} - 1) * 20` : ''}    
                `);
                followers = followersList.rows;
            }
            else followers = [];

            res.json({ followers, following });
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    checkFollow : async(req, res) => {
        try {
            const { username, id_follower } = req.params;

            const user = await pool.query('SELECT _id FROM users WHERE username = $1', [username]);

            const follow_dup = await pool.query(
                'SELECT * FROM follows WHERE id_user = $1 AND id_follower = $2', [user.rows[0]._id, id_follower]
            );

            if(follow_dup.rows.length > 0) return res.json(true);
      
            res.json(false);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    deleteFollow : async(req, res) => {
        try {
            const { id, id_follower } = req.body;

            await pool.query(
                'DELETE FROM follows WHERE id_user = $1 AND id_follower = $2', [id, id_follower]
            );

            res.status(200).send('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }   
}
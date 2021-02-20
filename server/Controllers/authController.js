const pool = require('../db');
const bcrypt = require('bcrypt');
const TokensGenerator = require('../Utils/TokensGenerator');

module.exports = {
    postLogin : async(req, res) => {
        let users;

        try {
            const { user, password } = req.body;

            if(user.includes('@')) users = await pool.query('SELECT * FROM users WHERE email = $1', [user.trim()]);  
            else users = await pool.query('SELECT * FROM users WHERE username = $1', [user.trim()]); 

            if (users.rows.length === 0) return res.status(401).send('Invalid credencials.');
            if(!users.rows[0].verified) return res.status(403).send('Please confirm your email.')

            const validPassword = await bcrypt.compare(password, users.rows[0].password);
            if(!validPassword) return res.status(401).send('Invalid password.');

            const jwtToken = TokensGenerator(users.rows[0]._id);
            res.json({ jwtToken, userInfo: users.rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getVerificar : (req, res) => {
        res.json(true);
    }    
}
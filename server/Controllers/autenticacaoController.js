const pool = require('../db');
const bcrypt = require('bcrypt');
const GeradorTokens = require('../Utils/GeradorTokens');

module.exports = {
    postLogin : async function(req, res){
        let users;

        try {
            const { user, password } = req.body;

            if(user.includes('@')) users = await pool.query('SELECT * FROM users WHERE email = $1', [user.trim()]);  
            else users = await pool.query('SELECT * FROM users WHERE username = $1', [user.trim()]); 

            const userInfo = users.rows[0];

            if (users.rows.length === 0) return res.status(401).json('Invalid credencials.');
            if(!users.rows[0].verified) return res.status(403).json('Please confirm your email.')

            const validPassword = await bcrypt.compare(password, users.rows[0].password);
            if(!validPassword) return res.status(401).json('Invalid password.');

            const jwtToken = GeradorTokens(users.rows[0].email);
            return res.json({ jwtToken, userInfo });
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getVerificar : async function(req, res){
        try {
            res.json(true);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }    
}
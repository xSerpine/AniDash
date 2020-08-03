const pool = require("../db");
const bcrypt = require("bcrypt");
const GeradorTokens = require("../Utils/GeradorTokens");

module.exports = {
    postLogin : async function(req, res){
        const { user, password } = req.body;

        let users;

        try {

            if(user.includes("@"))
                users = await pool.query("SELECT * FROM utilizadores WHERE email = $1", [user.trim()]);  
            else 
                users = await pool.query("SELECT * FROM utilizadores WHERE username = $1", [user.trim()]); 

            const info = users.rows[0];

            if (users.rows.length === 0) {
                return res.status(401).json("Credenciais inválidas.");
            }

            const validPassword = await bcrypt.compare(password, users.rows[0].password);

            if(!validPassword) {
                return res.status(401).json("Palavra-Passe Inválida.");
            }

            const jwtToken = GeradorTokens(users.rows[0].email);
            return res.json({jwtToken, info });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getVerificar : async function(req, res){
        try {
            res.json(true);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    }    
}
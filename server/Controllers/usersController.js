const pool = require("../db");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../Utils/Cloudinary");

module.exports = {
    postRegister : async function(req, res){
        const { username, email, password, avatar } = req.body;

        let existe_username, existe_email;

        try { 
            const user = await pool.query(
                "select username, email from utilizadores"
            );

            existe_username = user.rows.map(user => (user.username === username));
            existe_email = user.rows.map(user => (user.email === email));
            
            if(existe_username.includes(true) && existe_email.includes(true)) return res.json("Both username and email are taken.")
            if(existe_username.includes(true)) return res.json("Username is already taken.");
            if(existe_email.includes(true)) return res.json("Email is already registered.")

            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const uploadedResponse = avatar != "" && await cloudinary.uploader.upload(avatar, {
                upload_preset: "dmpknj3w"
            }).catch(error => console.log(error));

            await pool.query(
                "INSERT INTO utilizadores (username, email, password, avatar) VALUES ($1,$2,$3,$4) RETURNING *",
                [username, email, bcryptPassword, avatar == "" ? avatar : uploadedResponse.secure_url]
            );
  
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    putAvatar : async function(req, res){
        const { email, avatar } = req.body;

        try { 
            const uploadedResponse = await cloudinary.uploader.upload(avatar, {
                upload_preset: "dmpknj3w"
            });
                
            await pool.query(
                "update utilizadores set avatar = $1 where email = $2",
                [uploadedResponse.secure_url, email]
            );
  
            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getUser : async function(req, res){
        let users;

        try{
            const { user } = req.params;

            if(user.includes("@"))
                users = await pool.query("SELECT * FROM utilizadores WHERE email = $1", [user]);  
            else 
                users = await pool.query("SELECT * FROM utilizadores WHERE username = $1", [user]); 

            res.json(users.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },

    getUsers : async function(req, res){
        try{
            const { search_query } = req.params;
            const page = req.query.page;

            const users = await pool.query(`
                select lower(username) as username, email, avatar from utilizadores 
                where username like '%${search_query}%'
                limit 50 OFFSET (${page} - 1) * 50
            `); 

            res.json(users.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    },
    
    putPostsPerPage : async function(req, res){
        try{
            const { postsPerPageHome, postsPerPageAnimeManga, postsPerPageDetails, postsPerPageProfile, username } = req.body;

            await pool.query(`
                update utilizadores
                set postsperpagehome = $1, postsperpageanimemanga = $2, postsperpagedetails = $3, postsperpageprofile = $4
                where username = $5
            `, [postsPerPageHome, postsPerPageAnimeManga, postsPerPageDetails, postsPerPageProfile, username]); 

            res.json("OK");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ocorreu um erro no servidor.");
        }
    } 
}
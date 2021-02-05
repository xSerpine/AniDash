require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('nodemailer');
const { cloudinary } = require('../Utils/Cloudinary');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: 'luisferroapps@gmail.com',
      pass: 'I9e39!mIAJqe'
    }
});

module.exports = {
    postRegister : async function(req, res){
        let usernameExists, emailExists;

        try { 
            const { username, email, password, avatar } = req.body;

            const user = await pool.query('SELECT username, email FROM users');

            usernameExists = user.rows.some(user => (user.username === username));
            emailExists = user.rows.some(user => (user.email === email));
            
            if(usernameExists && emailExists) return res.json('Both username and email are taken.')
            if(usernameExists) return res.json('Username is already taken.');
            if(emailExists) return res.json('Email is already registered.')

            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const uploadedResponse = avatar != '' && await cloudinary.uploader.upload(avatar, {
                upload_preset: 'dmpknj3w'
            }).catch(error => console.error(error));

            const emailToken = cryptoRandomString({length: 16, type: 'url-safe'});

            const mailOptions = {
                from: 'noreply@anidash.com',
                to: email,
                subject: 'Anidash - Email Confirmation',
                text: `
                    Hello, ${username}!

                    Welcome to Anidash!
                    Please confirm your email to unlock all the features we have for you.

                    ${process.env.CLIENT_URL}/confirm/${emailToken}

                    Best regards,
                    Luís Ferro
                `,
                html: `
                    <p>Hello, ${username}!</p>
                    <p>Welcome to Anidash!</p>
                    <p>Please confirm your email to unlock all the features we have for you.</p>
      
                    <a href='${process.env.CLIENT_URL}/confirm/${emailToken}'>Confirm your email</a>

                    <p>Best regards, <br/> Luís Ferro</p>
                `
            };

            transporter.sendMail(mailOptions, error => {
                if (error) return res.json('An error as occurred. Please try again later.');
            });

            await pool.query(
                'INSERT INTO users (username, email, password, avatar, verified, token) VALUES ($1,$2,$3,$4,$5,$6)',
                [username, email, bcryptPassword, avatar == '' ? avatar : uploadedResponse.secure_url, false, emailToken]
            );
    
            return res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    postRecoverMethod : async function(req, res){
        try { 
            const { email } = req.body;
        
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);  

            if(user.rows.length === 0) return res.status(404).json("Couldn't find an account using this email.");
                
            const recoverToken = cryptoRandomString({length: 16, type: 'url-safe'});

            const mailOptions = {
                from: 'noreply@anidash.com',
                to: email,
                subject: 'Anidash - Recover Password',
                text: `
                    Hello, ${user.rows[0].username}!

                    We have received a password recovery request for your account.

                    ${process.env.CLIENT_URL}/forgot/${recoverToken}

                    Best regards,
                    Luís Ferro
                `,
                html: `
                    <p>Hello, ${user.rows[0].username}!</p>
                    <p>We have received a password recovery request for your account.</p>
      
                    <a href='${process.env.CLIENT_URL}/forgot/${recoverToken}'>Recover your password</a>

                    <p>Best regards, <br/> Luís Ferro</p>
                `
            };

            transporter.sendMail(mailOptions, error => {
                if (error) return res.json('An error as occurred. Please try again later.');
            });

            await pool.query(
                'UPDATE users SET token = $1 WHERE email = $2',
                [recoverToken, user.rows[0].email]
            );

            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putVerifiedUser : async function(req, res){
        try { 
            const { token } = req.body;
        
            const user = await pool.query('SELECT * FROM users WHERE token = $1', [token]);  

            if(user.rows.length === 0) return res.status(404).json("Couldn't confirm your account.");
                
            await pool.query(
                'UPDATE users SET verified = $1, token = $2 WHERE email = $3',
                [true, null, user.rows[0].email]
            );
  
            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putPasswordUser : async function(req, res){
        try { 
            const { token, password } = req.body;
        
            const user = await pool.query('SELECT * FROM users WHERE token = $1', [token]);  

            if(user.rows.length === 0) return res.status(404).json("Couldn't update your password.");

            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);
                
            await pool.query(
                'UPDATE users SET token = $1, password = $2 WHERE email = $3',
                [null, bcryptPassword, user.rows[0].email]
            );
  
            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    putAvatar : async function(req, res){
        try { 
            const { email, avatar } = req.body;
            
            const uploadedResponse = await cloudinary.uploader.upload(avatar, {
                upload_preset: 'dmpknj3w'
            });
                
            await pool.query(
                'UPDATE users SET avatar = $1 WHERE email = $2',
                [uploadedResponse.secure_url, email]
            );
  
            res.json('OK');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getUser : async function(req, res){
        let users;

        try{
            const { user } = req.params;

            if(user.includes('@'))
                users = await pool.query('SELECT * FROM users WHERE email = $1', [user]);  
            else 
                users = await pool.query('SELECT * FROM users WHERE username = $1', [user]); 

            if(users.rows.length === 0) res.status(404);

            res.json(users.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getUsers : async function(req, res){
        try{
            const { query } = req.params;
            const page = req.query.page;

            const users = await pool.query(`
                SELECT lower(username) as username, email, avatar FROM users 
                WHERE username LIKE '%${query}%'
                LIMIT 50 OFFSET (${page} - 1) * 50
            `); 

            res.json(users.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    },

    getStats : async function(req, res){
        let users;

        try{
            const { user } = req.params;

            if(user.includes('@')) users = await pool.query('SELECT * FROM users WHERE email = $1', [user]);  
            else users = await pool.query('SELECT * FROM users WHERE username = $1', [user]);

            const animeCount = await pool.query(`
                SELECT COUNT(*) FROM animefavorites 
                WHERE id_user = $1
            `, [users.rows[0]._id]);

            const mangaCount = await pool.query(`
                SELECT COUNT(*) FROM mangafavorites 
                WHERE id_user = $1
            `, [users.rows[0]._id]);

            const followersCount = await pool.query(`
                SELECT COUNT(*) FROM follows 
                WHERE id_user = $1
            `, [users.rows[0]._id]); 

            const followingCount = await pool.query(`
                SELECT COUNT(*) FROM follows 
                WHERE id_follower = $1
            `, [users.rows[0]._id]); 

            const showsCount = await pool.query(`
                SELECT SUM(watched) FROM animefavorites 
                WHERE id_user = $1 AND (type_anime = 'TV' OR type_anime = 'ONA')
            `, [users.rows[0]._id]);

            const moviesCount = await pool.query(`
                SELECT SUM(watched) FROM animefavorites 
                WHERE id_user = $1 AND type_anime = 'Movie'
            `, [users.rows[0]._id]);

            const chaptersCount = await pool.query(`
                SELECT SUM(read) FROM mangafavorites 
                WHERE id_user = $1
            `, [users.rows[0]._id]);

            const timeSpent = 23 * parseInt(showsCount.rows[0].sum) + 90 * parseInt(moviesCount.rows[0].sum);
            const episodesCount = parseInt(showsCount.rows[0].sum) + parseInt(moviesCount.rows[0].sum);

            res.json({ 
                anime: animeCount.rows[0].count, 
                manga: mangaCount.rows[0].count, 
                followers: followersCount.rows[0].count, 
                following: followingCount.rows[0].count, 
                timeSpent,
                episodes: episodesCount,
                chapters: chaptersCount.rows[0].sum
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Ocorreu um erro no servidor.');
        }
    }
}
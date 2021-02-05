const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));

//----------------------------------------------------------------------

app.get('/', function(req, res) {
	res.json({
		'Autor': 'Luís Ferro',
		'Github': 'https://github.com/xSerpine',
		'LinkedIn': 'https://www.linkedin.com/in/luis-ferro/',
		'Repositório': 'https://github.com/xSerpine/AniDash',
		'Cliente': 'https://anidashapi.netlify.app/'
	})
})
app.use('/autenticar', require('./Routes/autenticacaoRoute'));
app.use('/users', require('./Routes/usersRoute'));
app.use('/follow', require('./Routes/followRoute'));
app.use('/favoritos', require('./Routes/favoritosRoute'));
app.use('/activity', require('./Routes/activityRoute'));

//----------------------------------------------------------------------

app.listen(PORT, () => {
	console.log(`Servidor iniciado na porta ${PORT}`);
});
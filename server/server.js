const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));

//----------------------------------------------------------------------

app.get('/', (req, res) => {
	res.json({
		'Autor': 'Luís Ferro',
		'Github': 'https://github.com/xSerpine',
		'LinkedIn': 'https://www.linkedin.com/in/luis-ferro/',
		'Repositório': 'https://github.com/xSerpine/AniDash',
		'Cliente': 'https://anidashapi.netlify.app/'
	})
})
app.use('/auth', require('./Routes/authRoute'));
app.use('/users', require('./Routes/usersRoute'));
app.use('/follows', require('./Routes/followsRoute'));
app.use('/favorites', require('./Routes/favoritesRoute'));
app.use('/activity', require('./Routes/activityRoute'));

//----------------------------------------------------------------------

app.listen(PORT, () => {
	console.log(`Servidor iniciado na porta ${PORT}`);
});
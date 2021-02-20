require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.header('Authorization');
	if(!token) res.status(401).json(false);

	try {
		const payload = jwt.verify(token, process.env.JWT_TOKEN);
		req.user = payload;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).send('Access Denied');
	}
};
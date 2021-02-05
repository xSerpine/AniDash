require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwttoken = process.env.JWT_TOKEN;

module.exports = function(req, res, next) {
	const token = req.header('jwtToken');

	if (!token) return res.status(403).send(false);

	try {
		const payload = jwt.verify(token, jwttoken);

		req.user = payload.user;
		next();
	} catch (error) {
		console.log(error)
		res.status(401).send(false);
	}
};
require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtGenerator = (user_id) => {
	const payload = {
		user: {
			id: user_id
		}
  	};
  
 	return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '7d' });
}

module.exports = jwtGenerator;
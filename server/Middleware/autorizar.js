require('dotenv').config();
const jwt = require("jsonwebtoken");
const jwttoken = process.env.JWT_TOKEN;

module.exports = function(req, res, next) {
  const token = req.header("jwtToken");

  if (!token) {
    return res.status(403).send("Não tens permissões.");
  }

  try {
    const payload = jwt.verify(token, jwttoken);

    req.user = payload.user;
    next();
  } catch (err) {
    res.status(401).send("Token inválida.");
  }
};
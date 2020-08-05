const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb", extended: true }));

//----------------------------------------------------------------------

app.get("/", function(req, res) {
	res.json({
		"Autor": "Serpine",
		"Github": "https://github.com/xSerpine/AniDash",
		"Cliente": "https://anidash.herokuapp.com/"
	})
})
app.use("/autenticar", require("./Routes/autenticacaoRoute"));
app.use("/users", require("./Routes/usersRoute"));
app.use("/follow", require("./Routes/followRoute"));
app.use("/favoritos", require("./Routes/favoritosRoute"));
app.use("/activity", require("./Routes/activityRoute"));

//----------------------------------------------------------------------

app.listen(PORT, () => {
	console.log("Servidor iniciado na porta " + PORT);
});
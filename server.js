const express = require("express");
const bodyParser = require("body-parser");
const { repondre } = require("./agent");

const app = express();

app.use(bodyParser.json());
app.use(express.static(".")); // sert index.html

app.post("/chat", (req, res) => {
  const message = req.body.message;
  const reponse = repondre(message);
  res.json({ reply: reponse });
});

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const { repondre } = require("./agent");

// ROUTE CHAT
app.post("/chat", (req, res) => {
  const message = req.body.message;
const response = repondre(message);
  res.json({ reply: response });
});

// PORT RENDER OBLIGATOIRE
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});
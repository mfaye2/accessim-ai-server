const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Accessim AI opérationnel ✅");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const history = req.body.history || [];

    // Mode test local : ne consomme pas Gemini
    if (message.toLowerCase().includes("test")) {
      return res.json({
        reply: "Réponse de test locale ✅ Le chatbot fonctionne sans appeler Gemini."
      });
    }

    console.log("Message reçu :", message);

    const historyText = history
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
Tu es l'assistant IA du site Accessim AI.

Accessim AI propose :
- création de chatbots IA pour sites web
- automatisation avec n8n
- agents IA sur mesure
- formulaires intelligents
- CRM, relances automatiques, emails automatiques
- tableaux de bord et data
- maintenance et amélioration des automatisations

Ton rôle :
- répondre comme assistant commercial d'Accessim AI
- expliquer les services simplement
- qualifier le besoin du visiteur
- proposer de réserver un appel
- rester court, clair et professionnel
- ne jamais dire que tu es seulement une IA générale

Contact :
Email : fayemouhamadoulatyr@gmail.com
Téléphone : 06 41 93 33 63
Calendly : https://calendly.com/fayelatyr61/30min

Historique de la conversation :
${historyText}

Dernière question du visiteur :
${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Réponse Gemini :", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Erreur Gemini : " + JSON.stringify(data)
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini n’a pas renvoyé de texte.";

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error("Erreur serveur :", error);

    res.status(500).json({
      reply: "Erreur serveur : impossible de répondre pour le moment."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
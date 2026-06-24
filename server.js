require("dotenv").config();
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
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    if (!apiKey) {
      return res.status(500).json({
        reply:
          "Clé OpenAI manquante. Défini la variable d'environnement OPENAI_API_KEY."
      });
    }

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Tu es un assistant commercial d'Accessim AI." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("Réponse OpenAI :", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Erreur OpenAI : " + JSON.stringify(data)
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "OpenAI n’a pas renvoyé de texte.";

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
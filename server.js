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
    const apiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return res.status(500).json({
        reply:
          "Clé Gemini manquante. Défini la variable d'environnement GEMINI_API_KEY_2 ou GEMINI_API_KEY."
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

    async function callGemini(promptText) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const maxAttempts = 3;
      let lastData = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        lastData = data;

        if (response.ok) {
          return { ok: true, data };
        }

        const shouldRetry =
          response.status === 503 ||
          data?.error?.status === "UNAVAILABLE" ||
          data?.error?.code === 503;

        if (!shouldRetry || attempt === maxAttempts) {
          return { ok: false, data };
        }

        const delayMs = attempt * 1000;
        console.warn(
          `Gemini indisponible, tentative ${attempt}/${maxAttempts}. Nouvelle tentative dans ${delayMs}ms.`,
          data
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      return { ok: false, data: lastData };
    }

    const result = await callGemini(prompt);

    console.log("Réponse Gemini :", result.data);

    if (!result.ok) {
      return res.status(500).json({
        reply:
          "Erreur Gemini : " +
          JSON.stringify(result.data) +
          " (réessayé automatiquement si le service était occupé)."
      });
    }

    const reply =
      result.data.candidates?.[0]?.content?.parts?.[0]?.text ||
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
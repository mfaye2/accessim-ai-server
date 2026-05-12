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
    if (message.includes("test")) {
  return res.json({
    reply: "Réponse de test locale."
  });
}

    console.log("Message reçu :", message);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `
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
- ne jamais dire que tu es seulement une IA générale d'OpenAI

Contact :
Email : fayemouhamadoulatyr@gmail.com
Téléphone : 06 41 93 33 63
Calendly : https://calendly.com/fayelatyr61/30min

Question du visiteur :
${message}
` 

      })
    });

    const data = await response.json();

    console.log("Réponse OpenAI :", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Erreur OpenAI : " + JSON.stringify(data)
      });
    }

   console.log("Réponse OpenAI complète :", JSON.stringify(data, null, 2));

res.json({

reply: data.output[0].content[0].text

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
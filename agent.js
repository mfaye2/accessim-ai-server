const readline = require("readline");
const fs = require("fs");

// ==============================
// MÉMOIRE SIMPLE
// ==============================
let dernierSujet = "";
let dernierType = "";
let clientInteresse = false;

// ==============================
// OFFRES / TARIFS
// ==============================
const offres = {
  email: {
    nom: "Automatisation emails",
    setup: 150,
    mensuel: 39,
    description: "Automatisation des réponses, relances, tri des demandes et notifications."
  },
  facture: {
    nom: "Automatisation factures",
    setup: 200,
    mensuel: 49,
    description: "Création, classement, suivi ou rappel automatique des factures."
  },
  crm: {
    nom: "Automatisation CRM",
    setup: 300,
    mensuel: 79,
    description: "Suivi des prospects, relances automatiques, fiches clients et notifications."
  },
  chatbot: {
    nom: "Chatbot IA site web",
    setup: 350,
    mensuel: 79,
    description: "Chatbot pour répondre aux visiteurs, qualifier les prospects et guider les clients."
  },
  agent: {
    nom: "Agent IA sur mesure",
    setup: 500,
    mensuel: 99,
    description: "Agent IA adapté à vos processus : support, ventes, documents, reporting ou automatisation."
  },
  data: {
    nom: "Dashboard / Data",
    setup: 300,
    mensuel: 59,
    description: "Tableaux de bord, reporting, KPI et exploitation de vos données."
  },
  audit: {
    nom: "Audit gain de temps",
    setup: 100,
    mensuel: 0,
    description: "Étude de vos tâches pour identifier ce qui peut être automatisé."
  }
};

// ==============================
// HISTORIQUE
// ==============================
function lireHistorique() {
  if (fs.existsSync("historique.txt")) {
    return fs.readFileSync("historique.txt", "utf-8");
  }
  return "";
}

function enregistrerHistorique(message, reponse) {
  const ligne =
    "Client : " + message + "\n" +
    "Agent IA : " + reponse + "\n" +
    "----------------------\n";

  fs.appendFileSync("historique.txt", ligne);
}

// ==============================
// OUTILS TEXTE
// ==============================
function contient(texte, mots) {
  return mots.some(mot => texte.includes(mot));
}

function detecterType(texte) {
  if (contient(texte, ["email", "mail", "gmail", "relance", "réponse automatique"])) {
    return "email";
  }

  if (contient(texte, ["facture", "facturation", "devis facture", "paiement", "relance facture"])) {
    return "facture";
  }

  if (contient(texte, ["crm", "prospect", "client", "pipeline commercial", "lead"])) {
    return "crm";
  }

  if (contient(texte, ["chatbot", "chat bot", "bot", "site web", "visiteur"])) {
    return "chatbot";
  }

  if (contient(texte, ["agent ia", "assistant ia", "agent intelligent", "assistant intelligent"])) {
    return "agent";
  }

  if (contient(texte, ["dashboard", "tableau de bord", "kpi", "power bi", "data", "données", "reporting"])) {
    return "data";
  }

  if (contient(texte, ["audit", "étude", "gain de temps", "diagnostic", "analyser mes tâches"])) {
    return "audit";
  }

  return "";
}

function formatOffre(type) {
  const offre = offres[type];

  if (!offre) {
    return "Je peux vous proposer une solution sur mesure après analyse de votre besoin.";
  }

  let texte =
    "Offre : " + offre.nom + "\n" +
    "- Mise en place : à partir de " + offre.setup + "€\n";

  if (offre.mensuel > 0) {
    texte += "- Abonnement : à partir de " + offre.mensuel + "€/mois\n";
  } else {
    texte += "- Abonnement : non obligatoire\n";
  }

  texte += "- Détail : " + offre.description;

  return texte;
}

function genererDevis(type) {
  const offre = offres[type];

  if (!offre) {
    return "Pour générer un devis, précisez d’abord le besoin : emails, factures, CRM, chatbot, agent IA, data ou audit.";
  }

  return (
    "Voici un devis estimatif :\n" +
    "- Service : " + offre.nom + "\n" +
    "- Mise en place : " + offre.setup + "€\n" +
    "- Abonnement mensuel : " + offre.mensuel + "€/mois\n" +
    "- Inclus : configuration, tests, documentation simple et accompagnement.\n" +
    "- Objectif : gagner du temps et réduire les tâches répétitives.\n\n" +
    "Souhaitez-vous que je vous propose une version plus personnalisée ?"
  );
}

// ==============================
// RÉPONSE PRINCIPALE
// ==============================
function repondre(message) {
  const historique = lireHistorique();
  const texte = message.toLowerCase().trim();

  let reponses = [];

  // ==============================
  // COMMANDES SYSTÈME
  // ==============================
  if (texte === "historique") {
    return historique.length > 0 ? historique : "Aucun historique pour le moment.";
  }

  if (texte === "effacer historique") {
    fs.writeFileSync("historique.txt", "");
    return "Historique effacé avec succès.";
  }

  if (texte === "quit" || texte === "exit") {
    return "Pour arrêter le programme, appuyez sur CTRL + C.";
  }

  // ==============================
  // SALUTATIONS
  // ==============================
  if (contient(texte, ["bonjour", "salut", "hello", "bonsoir", "coucou"])) {
    reponses.push(
      "Bonjour 👋 Je suis l’assistant d’Accessim AI. Je peux vous aider sur l’automatisation, les chatbots, les agents IA, les tarifs ou un devis."
    );
  }

  if (contient(texte, ["merci", "super", "parfait"])) {
    reponses.push("Avec plaisir 👍 Souhaitez-vous que je vous propose une solution adaptée à votre besoin ?");
  }

  // ==============================
  // MÉMOIRE
  // ==============================
  if (contient(texte, ["souviens", "déjà parlé", "historique"])) {
    if (historique.length > 0) {
      reponses.push("Oui, nous avons déjà échangé. Je peux aussi afficher l’historique si vous tapez : historique");
    } else {
      reponses.push("Non, je n’ai pas encore d’historique enregistré.");
    }
  }

  // ==============================
  // URGENCE
  // ==============================
  if (contient(texte, ["urgent", "rapidement", "vite", "au plus vite", "immédiatement"])) {
    reponses.push(
      "Urgence détectée : votre demande semble prioritaire. Nous pouvons commencer par une solution simple et rapide."
    );
  }

  // ==============================
  // DEMANDE GÉNÉRALE AUTOMATISATION
  // ==============================
  if (contient(texte, ["automatiser", "automatisation", "automatique", "workflow", "processus"])) {
    reponses.push(
      "Oui, nous pouvons automatiser vos tâches répétitives : emails, factures, CRM, reporting, formulaires, support client ou suivi de prospects."
    );

    dernierSujet = "automatisation";
  }

  // ==============================
  // DÉTECTION DU BESOIN PRÉCIS
  // ==============================
  const typeDetecte = detecterType(texte);

  if (typeDetecte !== "") {
    dernierType = typeDetecte;
    reponses.push(formatOffre(typeDetecte));
  }

  // ==============================
  // SI LE CLIENT RÉPOND APRÈS UNE QUESTION
  // ==============================
  if (dernierSujet === "automatisation" && typeDetecte !== "") {
    dernierSujet = "";
    reponses.push(
      "C’est un bon cas d’usage. On peut commencer par une version simple, puis l’améliorer selon vos retours."
    );
  }

  if (dernierSujet === "automatisation" && typeDetecte === "" && contient(texte, ["oui", "ok", "d'accord"])) {
    return "Très bien. Quel type d’automatisation souhaitez-vous : emails, factures, CRM, chatbot, agent IA ou reporting ?";
  }

  // ==============================
  // CHATBOT
  // ==============================
  if (contient(texte, ["chatbot", "bot de discussion", "chat sur mon site"])) {
    reponses.push(
      "Un chatbot peut répondre aux visiteurs de votre site, qualifier les prospects, expliquer vos services et réduire les demandes répétitives."
    );
  }

  // ==============================
  // AGENT IA
  // ==============================
  if (contient(texte, ["agent ia", "assistant ia", "agent intelligent"])) {
    reponses.push(
      "Un agent IA va plus loin qu’un simple chatbot : il peut analyser une demande, choisir une action, utiliser une mémoire et déclencher des automatisations."
    );
  }

  // ==============================
  // TARIFS
  // ==============================
  if (contient(texte, ["prix", "tarif", "coût", "combien", "budget"])) {
    reponses.push(
      "Les tarifs dépendent du besoin. En général :\n" +
      "- Audit gain de temps : à partir de 100€\n" +
      "- Automatisation emails : à partir de 150€ + 39€/mois\n" +
      "- Automatisation factures : à partir de 200€ + 49€/mois\n" +
      "- Automatisation CRM : à partir de 300€ + 79€/mois\n" +
      "- Chatbot IA : à partir de 350€ + 79€/mois\n" +
      "- Agent IA sur mesure : à partir de 500€ + 99€/mois"
    );
  }

  // ==============================
  // DEVIS
  // ==============================
  if (contient(texte, ["devis", "estimation", "proposition"])) {
    if (dernierType === "") {
      return "Pour générer un devis, précisez le besoin : emails, factures, CRM, chatbot, agent IA, data ou audit.";
    }

    return genererDevis(dernierType);
  }

  // ==============================
  // RENDEZ-VOUS
  // ==============================
  if (contient(texte, ["rendez-vous", "rdv", "appel", "calendly", "discuter"])) {
    reponses.push(
      "Vous pouvez réserver un appel gratuit pour présenter votre besoin et voir ce qui peut être automatisé."
    );
  }

  // ==============================
  // MAINTENANCE
  // ==============================
  if (contient(texte, ["maintenance", "suivi", "support", "corriger", "améliorer"])) {
    reponses.push(
      "Oui, nous pouvons assurer la maintenance : correction, amélioration, suivi des performances et adaptation de l’agent IA dans le temps."
    );
  }

  // ==============================
  // SÉCURITÉ / API / CLÉ
  // ==============================
  if (contient(texte, ["clé api", "api openai", "openai", "sécurité", "site web"])) {
    reponses.push(
      "Pour un chatbot connecté à OpenAI, la clé API ne doit jamais être visible dans le navigateur. Elle doit rester côté serveur pour éviter les abus."
    );
  }

  // ==============================
  // USAGE ABUSIF / LIMITES
  // ==============================
  if (contient(texte, ["trop de messages", "limite", "abus", "spam", "curieux"])) {
    reponses.push(
      "Il est conseillé de limiter le nombre de messages par jour, d’ajouter un CAPTCHA et de prévoir un abonnement selon le volume d’utilisation."
    );
  }

  // ==============================
  // INTÉRÊT CLIENT / CONCLUSION
  // ==============================
  if (contient(texte, ["oui", "ok", "intéressé", "ça m'intéresse", "d'accord", "go"])) {
    clientInteresse = true;

    if (dernierType !== "") {
      return (
        "Parfait 👍 Nous pouvons démarrer avec :\n" +
        formatOffre(dernierType) + "\n\n" +
        "Prochaine étape : souhaitez-vous un devis détaillé ou un appel pour cadrer le besoin ?"
      );
    }

    reponses.push(
      "Très bien 👍 Pour avancer, précisez le type de besoin : emails, factures, CRM, chatbot, agent IA, data ou audit."
    );
  }

  // ==============================
  // QUESTION SI AUTOMATISATION MAIS PAS DE TYPE
  // ==============================
  if (
    dernierSujet === "automatisation" &&
    dernierType === "" &&
    !contient(texte, ["email", "facture", "crm", "chatbot", "agent", "data", "dashboard"])
  ) {
    reponses.push(
      "Quel type d’automatisation souhaitez-vous mettre en place : emails, factures, CRM, chatbot, agent IA ou reporting ?"
    );
  }

  // ==============================
  // RÉPONSE PAR DÉFAUT
  // ==============================
  if (reponses.length === 0) {
    return (
      "Pouvez-vous préciser votre besoin ?\n" +
      "Exemples :\n" +
      "- Je veux automatiser mes emails\n" +
      "- Je veux un chatbot pour mon site\n" +
      "- Je veux un agent IA pour répondre aux clients\n" +
      "- Je veux connaître les tarifs\n" +
      "- Je veux un devis"
    );
  }

  return reponses.join("\n");
}

// ==============================
// MODE TERMINAL
// ==============================
function poserQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function boucle() {
    rl.question("Client : ", (message) => {
      const reponse = repondre(message);

      console.log("Agent IA :", reponse);

      enregistrerHistorique(message, reponse);

      boucle();
    });
  }

  boucle();
}

// Si le fichier est lancé directement : node agent.js
if (require.main === module) {
  poserQuestion();
}

// Si le fichier est utilisé par server.js
module.exports = { repondre };
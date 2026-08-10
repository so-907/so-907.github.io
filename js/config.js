/* ============================================================
   CONFIG.JS
   Tutto quello che vuoi personalizzare vive qui dentro.
   Cambia questi valori: il resto del sito si aggiorna da solo,
   non serve toccare index.html, style.css o gli altri script.
   Le righe con "✏️" sono quelle che ti conviene rivedere.
   ============================================================ */

const CONFIG = {

  player: {
    name: "Sonia Sapia",
    handle: "so-907",
    role: "AI & Robotics Student",              // dal bio del tuo profilo GitHub
    base: "Sapienza University of Rome",
    tagline: "Costruisco modelli che imparano a leggere, guardare e riconoscere pattern nei dati.",
    bio: [
      "Studio intelligenza artificiale applicata a linguaggio e dati, con un occhio sempre puntato su come e perché un modello arriva a una certa risposta.",
      "Il codice qui sotto è quello con cui mi sono sporcata le mani finora: notebook, modelli, dataset. Il resto della storia è ancora \"in sviluppo\"."
    ]
  },

  socials: {
    github: "https://github.com/so-907",
    linkedin: "https://www.linkedin.com/in/sonia-sapia-183b7524a",
    email: ""   // ✏️ aggiungi qui la tua email se vuoi che compaia nella sezione contatti
  },

  /* ✏️ PROGETTI — l'ordine qui sotto è l'ordine sullo scaffale delle cartucce.
     "icon" accetta: "target" | "chat" | "play" | "link"
     "color" accetta: "pink" | "cyan" | "yellow" | "violet"                */
  projects: [
    {
      title: "Clustering & Explainability",
      repo: "Clustering-and-explainability-on-European-Social-Survey",
      desc: "Clustering con K-Means sull'European Social Survey, con studio sull'explainability del modello. Progetto per Scienza ed Etica dei Dati, a.a. 2024/2025.",
      tags: ["Python", "K-Means", "Explainable AI", "Jupyter"],
      icon: "target",
      color: "cyan"
    },
    {
      title: "Sentiment Analysis · Recipe Reviews",
      repo: "Sentiment-Analysis-on-Recipe-Reviews",
      desc: "Modello di sentiment analysis sul dataset \u201cRecipe Reviews and User Feedback\u201d. Progetto per Intelligenza Artificiale 2, a.a. 2024/2025.",
      tags: ["Python", "NLP", "Sentiment Analysis", "Jupyter"],
      icon: "chat",
      color: "yellow"
    },
    {
      title: "RoBERTa YouTube Analyzer",
      repo: "roberta-youtube-analyzer",
      desc: "Sentiment analysis sui commenti YouTube con RoBERTa Transformers, costruito seguendo best practice MLOps.",
      tags: ["RoBERTa", "Transformers", "MLOps", "NLP"],
      icon: "play",
      color: "pink"
    },
    {
      title: "SNLI Textual Entailment",
      repo: "SNLI-textual-entailment",
      desc: "Modello di textual entailment sul dataset SNLI con architettura BiLSTM.",
      tags: ["BiLSTM", "SNLI", "Textual Entailment", "NLP"],
      icon: "link",
      color: "violet"
    }
  ],

  /* ✏️ SKILLS — raggruppa come preferisci, aggiungi/rimuovi voci liberamente */
  skills: [
    { group: "Linguaggi", items: ["Python"] },
    { group: "ML & DL", items: ["Machine Learning", "Deep Learning", "Explainable AI"] },
    { group: "NLP", items: ["Transformers", "RoBERTa", "BiLSTM", "Sentiment Analysis"] },
    { group: "Strumenti", items: ["Jupyter", "MLOps", "Git & GitHub"] }
  ],

  /* ✏️ TIMELINE — ho lasciato solo ciò che risulta dai tuoi repo pubblici,
     completa pure con le date/tappe esatte del tuo percorso                */
  timeline: [
    {
      year: "In corso",
      title: "Sapienza University of Rome",
      text: "Percorso di studi in ambito AI & Robotics."
    },
    {
      year: "2024/25",
      title: "Intelligenza Artificiale 2",
      text: "Sentiment analysis su recensioni di ricette \u2014 primo progetto NLP pubblicato."
    },
    {
      year: "2024/25",
      title: "Scienza ed Etica dei Dati",
      text: "Clustering ed explainability sull'European Social Survey: non solo cosa predice un modello, ma perch\u00e9."
    },
    {
      year: "Ultimi mesi",
      title: "NLP avanzato",
      text: "RoBERTa per sentiment su YouTube, BiLSTM per textual entailment su SNLI."
    }
  ],

  /* Testi del boot screen iniziale \u2014 puoi cambiarli o accorciare la lista */
  bootLines: [
    "AVVIO SONIA.EXE...",
    "CARICAMENTO MODULO NLP........ OK",
    "CARICAMENTO MODULO ML.......... OK",
    "CARICAMENTO MODULO CURIOSITA... OK",
    "PRONTO."
  ]
};

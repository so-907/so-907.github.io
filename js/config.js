/* ============================================================
   CONFIG.JS
   All personal information and portfolio data.
   ============================================================ */

const CONFIG = {

  player: {
    name: "Sonia Sapia",
    handle: "so-907",
    role: "MSc AI & Robotics Student",
    base: "Sapienza University of Rome",
    tagline: "Building intelligent models at the intersection of AI, Data Ethics, and Natural Language Processing.",
    bio: [
      "MSc student in Artificial Intelligence and Robotics at Sapienza University of Rome, with an interdisciplinary background spanning AI, Data Ethics, and Philosophy of Technology.",
      "Recipient of the ELICSIR Orthogonal School Excellence Fellowship. Currently focused on NLP, Generative AI, Machine Learning, and explainable data modeling."
    ]
  },

  socials: {
    github: "https://github.com/so-907",
    linkedin: "https://www.linkedin.com/in/sonia-sapia",
    email: "soniasapia03@gmail.com"
  },

  projects: [
    {
      title: "Clustering & Explainability",
      repo: "Clustering-and-explainability-on-European-Social-Survey",
      desc: "K-Means clustering pipeline applied to the European Social Survey dataset, integrated with model explainability analysis.",
      tags: ["Python", "K-Means", "Explainable AI", "Jupyter"],
      icon: "target",
      color: "cyan"
    },
    {
      title: "Sentiment Analysis · Recipe Reviews",
      repo: "Sentiment-Analysis-on-Recipe-Reviews",
      desc: "End-to-end sentiment analysis pipeline evaluated on the Recipe Reviews and User Feedback dataset.",
      tags: ["Python", "NLP", "Sentiment Analysis", "Jupyter"],
      icon: "chat",
      color: "yellow"
    },
    {
      title: "RoBERTa YouTube Analyzer",
      repo: "roberta-youtube-analyzer",
      desc: "YouTube comment sentiment classifier powered by RoBERTa Transformers and designed following MLOps best practices.",
      tags: ["RoBERTa", "Transformers", "MLOps", "NLP"],
      icon: "play",
      color: "pink"
    },
    {
      title: "SNLI Textual Entailment",
      repo: "SNLI-textual-entailment",
      desc: "Textual entailment classification architecture based on Bidirectional LSTM networks trained on the SNLI dataset.",
      tags: ["BiLSTM", "SNLI", "Textual Entailment", "NLP"],
      icon: "link",
      color: "violet"
    }
  ],

  skills: [
    { group: "Languages & Frameworks", items: ["Python", "PyTorch", "HuggingFace", "Scikit-Learn", "Pandas", "SQL", "MATLAB", "C++"] },
    { group: "Tools & Environment", items: ["Git", "Linux", "Docker", "LaTeX", "Jupyter"] },
    { group: "Core Domains", items: ["Machine Learning", "Multilingual NLP", "Generative AI", "Computer Vision", "Data Ethics"] }
  ],

  timeline: [
    {
      year: "10/2025 – Present",
      title: "ELICSIR Orthogonal School Fellowship",
      text: "Awarded a national merit fellowship granted to 20 selected Master's students across Italy, based on academic excellence and technical assessment."
    },
    {
      year: "2025 – Present",
      title: "MSc AI & Robotics · Sapienza University",
      text: "Graduate coursework focusing on Machine Learning, Computer Vision, Multilingual NLP, and Generative AI."
    },
    {
      year: "2022 – 2025",
      title: "BSc Philosophy & AI · Sapienza University",
      text: "Graduated with 110/110 (Full Marks). Final thesis and curriculum focused on AI, Data Ethics, Data Analysis, and Philosophy of Technology."
    },
    {
      year: "2024 – Present",
      title: "Academic Merit Grants",
      text: "Awarded academic assistantships at the DIAG Engineering Library, the ADIMUS museum asset digitization project, and the Philosophy Department Library."
    }
  ],

  bootLines: [
    "INITIALIZING SONIA.EXE...",
    "LOADING MODULE: NLP & GENERATIVE AI......... OK",
    "LOADING MODULE: DATA ETHICS & PHILOSOPHY... OK",
    "VERIFYING FELLOWSHIP CREDENTIALS........... OK",
    "SYSTEM READY."
  ]
};

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
    tagline: "Bridging Artificial Intelligence, Data Ethics, and Natural Language Processing.",
    bio: [
      "MSc Artificial Intelligence and Robotics student at Sapienza University of Rome with an interdisciplinary background spanning AI, Data Ethics, and Philosophy of Technology.",
      "Recipient of the ELICSIR Scuola Ortogonale Excellence Fellowship. Currently focusing on NLP, Generative AI, Machine Learning, and explainable data models."
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
      desc: "K-Means clustering on the European Social Survey dataset paired with model explainability analysis.",
      tags: ["Python", "K-Means", "Explainable AI", "Jupyter"],
      icon: "target",
      color: "cyan"
    },
    {
      title: "Sentiment Analysis · Recipe Reviews",
      repo: "Sentiment-Analysis-on-Recipe-Reviews",
      desc: "Sentiment analysis pipeline built on the Recipe Reviews and User Feedback dataset.",
      tags: ["Python", "NLP", "Sentiment Analysis", "Jupyter"],
      icon: "chat",
      color: "yellow"
    },
    {
      title: "RoBERTa YouTube Analyzer",
      repo: "roberta-youtube-analyzer",
      desc: "YouTube comments sentiment analysis powered by RoBERTa Transformers and designed with MLOps best practices.",
      tags: ["RoBERTa", "Transformers", "MLOps", "NLP"],
      icon: "play",
      color: "pink"
    },
    {
      title: "SNLI Textual Entailment",
      repo: "SNLI-textual-entailment",
      desc: "Textual entailment classification architecture using BiLSTM networks on the SNLI dataset.",
      tags: ["BiLSTM", "SNLI", "Textual Entailment", "NLP"],
      icon: "link",
      color: "violet"
    }
  ],

  skills: [
    { group: "Languages & Frameworks", items: ["Python", "PyTorch", "HuggingFace", "Scikit-Learn", "Pandas", "SQL", "MATLAB", "C++"] },
    { group: "Tools & Environment", items: ["Git", "Linux", "Docker", "LaTeX", "Jupyter"] },
    { group: "Domains", items: ["Machine Learning", "Multilingual NLP", "Generative AI", "Computer Vision", "Data Ethics"] }
  ],

  timeline: [
    {
      year: "10/2025 – Present",
      title: "ELICSIR Scuola Ortogonale Fellowship",
      text: "Awarded a national excellence fellowship granted to 20 top Master's students in Italy based on academic performance and technical evaluation."
    },
    {
      year: "2025 – Present",
      title: "MSc AI & Robotics · Sapienza",
      text: "Graduate coursework: Machine Learning, Computer Vision, Multilingual NLP, and Generative AI."
    },
    {
      year: "2022 – 2025",
      title: "BSc Philosophy & AI · Sapienza",
      text: "Graduated with 110/110. Thesis and coursework focused on AI, Data Ethics, Data Analysis, and Philosophy of Technology."
    },
    {
      year: "2024 – Present",
      title: "Academic Merit Grants",
      text: "Selected for student assistantships at DIAG Library, ADIMUS Project (museum asset digitization), and Philosophy Department Library."
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
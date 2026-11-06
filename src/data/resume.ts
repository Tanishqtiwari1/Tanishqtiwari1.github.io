/**
 * On-page resume. Mirrors public/Tanishq_Tewari_Resume.pdf (phone number intentionally left off the web version).
 * Update both together.
 */
export const resume = {
  updated: 'Nov 2026',
  summary:
    'Computer Science and Engineering undergraduate who completed a 2-month in-campus AI & ML program at IIT Mandi, covering deep learning, CNNs, NLP and model deployment. Team leader of the 2nd-place team at the OFFGRID Hackathon (IEEE Student Branch, Manipal University Jaipur). Builds and deploys end-to-end AI/ML systems with Python, PyTorch, Scikit-Learn, FastAPI and React. Seeking Software Engineering and AI/ML internships.',
  education: [
    {
      school: 'Manipal University Jaipur',
      degree: 'B.Tech, Computer Science and Engineering (AI & ML)',
      period: 'Oct 2024 – Aug 2028',
      note: 'Coursework: Data Structures & Algorithms, Advanced Data Structures, OOP, Machine Learning, Computer Vision, DBMS, Computer Networks, Embedded Systems',
    },
  ],
  projects: [
    {
      name: 'Black Box — Flight Recorder & Debugger for AI Agents',
      meta: "BNB'26 CodeStorm Hackathon, GDG on Campus · Oct 2026",
      tech: 'Python, PyTorch, GNN, FastAPI, OpenTelemetry, LLM Agents, Pytest',
      slug: 'blackbox',
      points: [
        'Records every LLM decision and tool call of an AI agent as OpenTelemetry traces, localizes the root cause of failures, replays the run and verifies the fix.',
        'PyTorch graph neural network with directional message passing: 93.1% top-1 root-cause accuracy (88.4% on unseen fault types) vs. 65.7% for a rule-based baseline, on 5,000 generated agent runs.',
        'Checkpointed, event-sourced replay re-executes only 34% of steps; 90.9% of failures fixed by repairing the top-ranked step, 98.1% within 3 replays; 29 Pytest tests.',
      ],
    },
    {
      name: 'GalliGraph — AI Civic Complaint Triage Platform',
      meta: '2nd Place, OFFGRID Hackathon · Oct 2026',
      tech: 'Python, Scikit-Learn, NLP, FastAPI, React, TypeScript, Docker',
      slug: 'galligraph',
      points: [
        'Led a 2-member team to turn free-text complaints in English, Hindi and Hinglish into a ranked, de-duplicated action queue for municipal officers.',
        'TF-IDF + Logistic Regression trained on 14,491 real complaints: 80.6% accuracy on 1,548 unseen 2022 complaints vs. 69.6% for keyword rules; 97% on a synthetic Hindi/Hinglish set.',
        'Geo-temporal duplicate detection with 96.4% precision (F1 0.90), cutting tickets by 56% (665 → 292); explainable priority, SLA escalation and Poisson spike detection at ~15 ms per complaint.',
        'Role-based access control, scrypt hashing, signed sessions and rate limiting; Dockerized and deployed on Render.',
      ],
    },
    {
      name: 'CardioGuard — AI Cardiovascular Risk Screening Platform',
      meta: 'Sep 2026',
      tech: 'Python, XGBoost, Scikit-Learn, FastAPI, React, PWA',
      slug: 'cardioguard',
      points: [
        'XGBoost with grid-search tuning on 918 real patients (UCI Heart Disease): 82.1% accuracy, 83.9% F1 and 0.915 ROC-AUC on a held-out test set.',
        'Detected data leakage in a popular Kaggle dataset where duplicate rows inflated accuracy to 97%, and rebuilt the preprocessing pipeline on clean data.',
        'Offline-first PWA for ASHA health workers with an in-browser Framingham model (0.73 CV ROC-AUC), Hindi/English UI, OCR of lab reports and PDF reports; CI/CD with GitHub Actions.',
      ],
    },
  ],
  achievements: [
    '2nd Place, OFFGRID Hackathon, TechIdeate 2026, IEEE Student Branch, Manipal University Jaipur (Oct 2026) — Team Leader of Team Codestorm.',
    'AI & ML In-Campus Certification, IIT Mandi (May – Jul 2026): Supervised Learning, Deep Learning, CNNs, NLP and Model Deployment.',
  ],
  skills: [
    { k: 'Languages', v: 'Python, C++, Java, C, SQL, JavaScript, TypeScript' },
    { k: 'ML & AI', v: 'Machine Learning, Deep Learning, NLP, Graph Neural Networks, LLM Agents, PyTorch, Scikit-Learn, XGBoost, Feature Engineering, Hyperparameter Tuning, Model Evaluation & Deployment, OCR' },
    { k: 'Backend', v: 'FastAPI, REST APIs, SQLite, OpenTelemetry, Role-Based Access Control, Authentication' },
    { k: 'Frontend', v: 'React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, PWA' },
    { k: 'Data', v: 'NumPy, Pandas, Matplotlib, Seaborn, Jupyter' },
    { k: 'Tools', v: 'Git, GitHub Actions (CI/CD), Docker, Linux, Pytest, VS Code, Render, Ollama, Groq API' },
    { k: 'CS Core', v: 'DSA, OOP, DBMS, Operating Systems, Computer Networks' },
  ],
}

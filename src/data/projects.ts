/**
 * Projects + case studies.
 * Every number here comes from the project's own README or Tanishq's resume. Never add unmeasured claims.
 * Sections left undefined are simply not rendered on the case-study page.
 */

export type FlowNode = { label: string; sub?: string; /** Shown when the node is selected in an interactive diagram. */ detail?: string }
export type Metric = { value: string; label: string; how?: string }
export type Shot = { src: string; caption: string; wide?: boolean }

export type Project = {
  slug: string
  index: string
  name: string
  tagline: string
  /** One-paragraph summary used on cards. */
  description: string
  /** Longer pitch used on the highlight block and case-study overview. */
  long?: string
  year?: string
  role?: string
  event?: string
  highlight?: string
  tech: string[]
  github?: string
  live?: string
  /** Screenshot of the product (public/img). Leave out to get a typographic card. */
  image?: string
  /** Shown as the big "highlight" project. */
  featured?: boolean
  /** Older / smaller work: listed compactly, not in the main showcase. */
  archive?: boolean
  stats?: Metric[]
  /** What Tanishq personally built (from his resume). Leave undefined if unknown — never guess. */
  contribution?: string[]
  /** How results were measured: dataset, method and honest limitations. */
  evaluation?: { dataset: string; method: string; limitations: string[] }
  /** Repository docs worth linking: README, architecture, model card, results. */
  docs?: { label: string; href: string }[]
  study: {
    problem?: string[]
    solution?: string[]
    howItWorks?: { title: string; body: string }[]
    architecture?: { caption: string; nodes: FlowNode[] }
    pipeline?: { caption: string; nodes: FlowNode[] }
    gallery?: Shot[]
    stack?: { group: string; items: string[] }[]
    challenges?: string[]
    learned?: string[]
    results?: Metric[]
    resultsNote?: string
  }
}

export const projects: Project[] = [
  {
    slug: 'galligraph',
    index: '01',
    name: 'GalliGraph',
    tagline: 'AI-powered Civic Complaint Intelligence Platform',
    description:
      'Converts unstructured citizen complaints — in English, Hindi and Hinglish — into structured, prioritised and routable civic issues, giving municipal officers a ranked, de-duplicated work queue with explainable priority scores.',
    long:
      'Indian cities receive complaints through apps, websites and WhatsApp as messy free text. Someone has to read each one and decide what it is, where, how bad, and who fixes it. GalliGraph does that triage automatically in ~15 ms per complaint, merges duplicates of the same pothole, ranks issues with reasons officers can read, and only closes an issue with evidence the citizen can verify.',
    year: 'Oct 2026',
    role: 'Team lead · Team Codestorm',
    event: 'OFFGRID Hackathon · TechIdeate 2026 · IEEE SB, Manipal University Jaipur',
    highlight: '🏆 2nd Place — OFFGRID Hackathon 2026',
    featured: true,
    tech: ['Python', 'Scikit-Learn', 'NLP', 'FastAPI', 'React', 'TypeScript', 'Docker'],
    github: 'https://github.com/Tanishqtiwari1/GalliGraph',
    live: 'https://galligraph.onrender.com',
    image: 'img/galligraph.webp',
    stats: [
      { value: '80.6%', label: 'Category accuracy, trained model', how: '1,548 unseen real 2022 complaints' },
      { value: '96.4%', label: 'Duplicate-merge precision', how: 'synthetic multilingual set' },
      { value: '~15 ms', label: 'Triage per complaint', how: 'laptop CPU, no GPU' },
    ],
    contribution: [
      'Led Team Codestorm (2 members) from problem statement to deployed product in the OFFGRID hackathon.',
      'Trained the TF-IDF (word + character n-gram) + logistic-regression classifier on 14,491 real complaints and evaluated it on a time split.',
      'Engineered geo-temporal duplicate detection, explainable priority scoring, SLA escalation and Poisson-based spike detection.',
      'Shipped citizen and officer portals with role-based access, scrypt password hashing, signed sessions and rate limiting; containerised with Docker and deployed on Render.',
    ],
    evaluation: {
      dataset: 'Real municipal complaints (trained on 2019–21, tested on 1,548 unseen 2022 complaints) plus two synthetic multilingual sets (661 and 788 complaints) with typos and vague landmarks.',
      method: 'Time-based split so the model never sees the future. Duplicate detection scored on labelled synthetic pairs, with a held-out second dataset. All numbers reproducible with the scripts in the repository.',
      limitations: [
        'The full system (model + multilingual rules) scores 78.0% on real data — it trades ~3 points on English to stay accurate on Hindi/Hinglish, which the model never saw.',
        'Citizen-chosen labels are sometimes wrong, which caps achievable accuracy.',
        'Hindi/Hinglish and duplicate metrics come from synthetic data; the 56% ticket reduction is on the simulated demo city, not a live deployment.',
        'Not yet piloted with a municipality (MUJ campus and Jaipur ward pilots are on the roadmap).',
      ],
    },
    docs: [
      { label: 'README', href: 'https://github.com/Tanishqtiwari1/GalliGraph#readme' },
      { label: 'Architecture', href: 'https://github.com/Tanishqtiwari1/GalliGraph#architecture' },
      { label: 'How the AI works', href: 'https://github.com/Tanishqtiwari1/GalliGraph#how-the-ai-works' },
      { label: 'Measured results', href: 'https://github.com/Tanishqtiwari1/GalliGraph#measured-results' },
    ],
    study: {
      problem: [
        'Indian cities receive civic complaints through apps, websites and WhatsApp as free text — often in English, Hindi or Hinglish, with typos and vague landmarks like "near the temple, gali no. 5".',
        'Someone has to read each one and decide what it is, where it is, how bad it is and who fixes it. On real data, 8.4% of 4,000 complaints repeated an issue that was already open, and citizens picking from 231 sub-categories often picked wrong.',
      ],
      solution: [
        'GalliGraph reads every complaint the way an experienced ward officer would, then hands officers a ranked, explainable, de-duplicated work queue — and closes the loop only with evidence the citizen can verify.',
        'Guiding principle: AI suggests, the authorised officer decides. Every override is audited and no issue is ever closed by AI alone.',
      ],
      howItWorks: [
        { title: 'Classification', body: 'TF-IDF over word and character n-grams feeding a logistic regression, trained on 14,491 real complaints, combined with a typo-tolerant multilingual keyword engine and language-aware thresholds.' },
        { title: 'De-duplication', body: 'Geo-temporal matching: same category, within 14 days, scored on text similarity, distance and time. Lane numbers and landmarks act as a "spot fingerprint" so gali 5 and gali 12 never merge.' },
        { title: 'Explainable priority', body: 'A 0–100 score from severity, population impact (schools/hospitals nearby), reports, duration and recurrence — every factor shown as a reason. Poisson-based spike detection flags sudden surges.' },
        { title: 'Routing & accountability', body: 'Routed to the right department with an SLA deadline and two-level escalation; officers review, assign, raise work orders and close with verified proof.' },
      ],
      architecture: {
        caption: 'One Docker container: React portals → FastAPI → triage pipeline → SQLite audit timeline.',
        nodes: [
          { label: 'Citizens & officers', sub: 'web · WhatsApp · voice', detail: 'Complaints arrive as text, Hindi voice notes, photos or map pins through the web portal or the WhatsApp bot. Ward officers and supervisors work in their own portal.' },
          { label: 'React + TypeScript', sub: 'two portals', detail: 'Citizen and officer portals over one record: report, track, review queue, assignment, work orders and verified closure — with a Hindi UI and dark mode.' },
          { label: 'FastAPI', sub: 'auth · roles · rate limits', detail: 'REST API with role-based access, scrypt password hashing, signed sessions and rate limiting; Twilio WhatsApp webhooks with signature verification.' },
          { label: 'Triage pipeline', sub: 'classify · dedupe · rank', detail: 'Detect language → classify (TF-IDF + logistic regression with multilingual keyword rules) → geocode → spot fingerprint → embed → merge duplicates → explainable 0–100 priority → route with an SLA. Every AI step has a deterministic fallback, so it keeps working offline.' },
          { label: 'SQLite', sub: 'records + audit trail', detail: 'The single record of every complaint and issue, with an audit timeline: each AI suggestion and every officer override is logged. No issue is ever closed by AI alone.' },
          { label: 'Optional services', sub: 'OSM · LLM · SMS', detail: 'OpenStreetMap Nominatim for geocoding, an optional local LLM (Ollama) or Claude for extraction, and Twilio SMS — all optional, each with a fallback.' },
        ],
      },
      pipeline: {
        caption: 'Per-complaint pipeline. Every AI step has a deterministic fallback, so it keeps working offline.',
        nodes: [
          { label: 'Complaint', sub: 'free text' },
          { label: 'Detect language', sub: 'EN / HI / Hinglish' },
          { label: 'Classify', sub: 'TF-IDF + LogReg' },
          { label: 'Geocode', sub: 'GPS → landmark → OSM' },
          { label: 'Duplicate?', sub: 'merge or new issue' },
          { label: 'Priority', sub: '0–100 with reasons' },
          { label: 'Route + SLA', sub: 'department · deadline' },
        ],
      },
      gallery: [
        { src: 'img/offgrid-award.webp', caption: 'Receiving the 2nd Position award at OFFGRID, TechIdeate 2026 — Manipal University Jaipur. Photo: Aperture, Digital Arts Society.', wide: true },
        { src: 'img/galligraph.webp', caption: 'Citizen portal — report, track and see civic health at a glance.' },
      ],
      stack: [
        { group: 'AI / ML', items: ['Scikit-Learn', 'TF-IDF', 'Logistic Regression', 'NLP'] },
        { group: 'Backend', items: ['Python', 'FastAPI', 'SQLite'] },
        { group: 'Frontend', items: ['React', 'TypeScript'] },
        { group: 'Infra', items: ['Docker', 'Render', 'OpenStreetMap', 'Twilio WhatsApp'] },
      ],
      challenges: [
        'Hinglish and Devanagari text with typos — fuzzy phrase matching and stricter model thresholds for Hindi inputs.',
        'Avoiding false merges between nearby but different spots — lane/landmark fingerprints and a 300 m geo cutoff.',
        'Keeping evaluation honest — trained on 2019–21 and tested on 2022 so the model never sees the future.',
        'Security for a public service — role-based access, scrypt password hashing, signed sessions and rate limiting.',
      ],
      learned: [
        'Real data reshapes requirements: analysing 4,000 real complaints changed which categories and routes mattered.',
        'Explainability is a product feature — officers trust a score they can read.',
        'Leading a two-person team under a hackathon clock means ruthless scoping.',
      ],
      results: [
        { value: '80.6%', label: 'Category accuracy of the trained model', how: '1,548 unseen real 2022 complaints, time split · keyword rules: 69.6% · full system: 78.0%' },
        { value: '97%', label: 'Category accuracy, Hindi/Hinglish', how: 'synthetic multilingual set (661 complaints) · held-out set: 96.7%' },
        { value: '96.4%', label: 'Duplicate-merge precision', how: 'synthetic set A · F1 0.903 (A), 0.866 (held-out B)' },
        { value: '8.4%', label: 'Real duplicates found', how: '4,000 real complaints replayed with real GPS + timestamps' },
        { value: '56%', label: 'Ticket reduction', how: 'simulated demo city: 665 complaints → 292 issues' },
        { value: '~15 ms', label: 'Triage latency per complaint', how: 'laptop CPU, no GPU, no paid API' },
      ],
      resultsNote: 'Experimental results from the repository’s evaluation scripts — not production performance.',
    },
  },
  {
    slug: 'blackbox',
    index: '02',
    name: 'Black Box',
    tagline: 'Flight Recorder & Debugger for AI Agents',
    description:
      'A debugging platform that records every LLM decision and tool call of an AI agent as OpenTelemetry traces, finds the step that actually caused a failure with a graph neural network, then replays from that step and verifies the fix — without re-running the whole agent.',
    long:
      'AI agents now book travel, answer customers and write code — and when one gives a wrong answer, nobody knows why. A run can have 30 steps of model decisions and tool calls, and one bad value early on passes silently through every later step. Black Box is a flight recorder for agents: it records the run, ranks the step that caused the failure (not just where it surfaced), explains why with evidence from the trace, and replays from a checkpoint so only the affected steps run again.',
    year: 'Oct 2026',
    event: "BNB'26 CodeStorm Hackathon · GDG on Campus",
    tech: ['Python', 'PyTorch', 'GNN', 'FastAPI', 'OpenTelemetry', 'LLM Agents', 'Pytest'],
    github: 'https://github.com/Tanishqtiwari1/BlackBox',
    live: 'https://blackbox-flight-recorder.onrender.com',
    image: 'img/blackbox.webp',
    stats: [
      { value: '93.1%', label: 'Top-1 root-cause accuracy', how: 'synthetic benchmark · rule baseline 65.7%' },
      { value: '88.4%', label: 'On unseen fault types', how: 'synthetic benchmark' },
      { value: '34%', label: 'Steps re-executed per replay', how: 'average' },
    ],
    contribution: [
      'Built the debugging platform end to end: OpenTelemetry trace ingestion, root-cause localisation, checkpointed replay and fix verification.',
      'Designed a PyTorch graph neural network with directional message passing over trace graphs.',
      'Implemented event-sourced replay that re-executes only the steps affected by a fix; covered by 29 Pytest tests and deployed live.',
    ],
    evaluation: {
      dataset: '5,000 generated runs of a travel-expense agent, one labelled fault injected per failing run; 6 training and 3 held-out fault types.',
      method: 'Evaluation runs never used for training; splits for unseen fault types, a moved error source and new agent behaviour. Compared against gradient boosting, a first-suspicious-step rule, Personalized PageRank and random.',
      limitations: [
        'Synthetic benchmark: on a completely different agent the true cause was ranked first in 9 of 18 failures, improving as Black Box builds that agent’s history.',
        'If an agent skips a step entirely, nothing anomalous is recorded at the cause.',
        'Replay needs an adapter: the built-in agent is fully replayable; uploaded and OTLP traces are diagnosis-only.',
      ],
    },
    docs: [
      { label: 'README', href: 'https://github.com/Tanishqtiwari1/BlackBox#readme' },
      { label: 'Architecture', href: 'https://github.com/Tanishqtiwari1/BlackBox#%EF%B8%8F-architecture' },
      { label: 'Results', href: 'https://github.com/Tanishqtiwari1/BlackBox#-results' },
      { label: 'Honest scope', href: 'https://github.com/Tanishqtiwari1/BlackBox#%EF%B8%8F-honest-scope' },
    ],
    study: {
      problem: [
        'AI agents are moving into production, but when an agent fails, the error usually shows up at the very end of a long chain of model calls and tool calls. The step that caused it can be ten steps earlier.',
        'Engineers debug this by reading logs line by line, then re-running the entire agent to test a fix — slow, expensive, and it repeats every model call.',
      ],
      solution: [
        'Black Box records every model decision and tool call as an OpenTelemetry trace, detects the failure, and ranks the step that caused it using a graph neural network trained on how errors propagate through trace graphs.',
        'It explains the diagnosis with evidence from the trace (e.g. a flight price 100× its historical baseline), replays from that step’s checkpoint reusing everything before it, repairs the step, and verifies the fix with a step-by-step diff.',
      ],
      howItWorks: [
        { title: 'Record', body: 'Agents emit OpenTelemetry spans using GenAI semantic conventions; a REST ingestion API turns each run into a trace graph of decisions and tool calls.' },
        { title: 'Detect & explain', body: 'A PyTorch GNN with directional message passing scores every step as a root-cause candidate, so it finds the first bad step even when the agent takes a new path.' },
        { title: 'Replay', body: 'Checkpointed, event-sourced replay restarts from the root-cause step and re-executes only what depends on it — about a third of the steps.' },
        { title: 'Repair & verify', body: 'Re-run the step, patch its output or patch its arguments, then verify with the task check and a diff of the original vs. repaired run.' },
      ],
      pipeline: {
        caption: 'The full loop, from a failed run to a verified fix.',
        nodes: [
          { label: 'Detect', sub: 'failed run' },
          { label: 'Explain', sub: 'GNN root cause' },
          { label: 'Replay', sub: 'from checkpoint' },
          { label: 'Repair', sub: 'patch the step' },
          { label: 'Verify', sub: 'task check + diff' },
        ],
      },
      architecture: {
        caption: 'Live demo agent runs on Groq (gpt-oss-20b) or locally on Ollama (qwen2.5:7b).',
        nodes: [
          { label: 'AI agent', sub: 'Groq / Ollama', detail: 'A tool-calling agent loop driven by Groq (gpt-oss-20b), a local Ollama model (qwen2.5:7b), or scripted policies for the benchmark.' },
          { label: 'OpenTelemetry', sub: 'GenAI spans', detail: 'Agents emit spans using the GenAI semantic conventions; OTLP/HTTP JSON ingestion turns each run into a step graph, so any instrumented agent can plug in.' },
          { label: 'FastAPI', sub: 'ingestion API', detail: 'REST endpoints and the static web app. A service layer is the only thing the API calls, and keeps per-agent baselines for external agents.' },
          { label: 'Trace graph', sub: 'steps + edges', detail: 'An append-only SQLite log of arguments, outputs, timing, errors and data-flow parents. Trace-only signals: grounding, per-tool baselines, retrieval checks and lineage.' },
          { label: 'GNN', sub: 'PyTorch', detail: 'A graph neural network with directional message passing ranks every step as a root-cause candidate (trained in PyTorch, NumPy inference). Occlusion-based evidence explains which signal drives the score.' },
          { label: 'Replay engine', sub: 'event-sourced', detail: 'Restores the checkpoint before the root cause, patches the step (re-run, new output or new arguments), re-plans dynamically and shows an aligned diff of the original vs repaired run.' },
        ],
      },
      gallery: [
        { src: 'img/blackbox.webp', caption: 'Landing — the failed run, its root cause and the impacted steps.', wide: true },
        { src: 'img/blackbox-graph.webp', caption: 'Investigation graph: how the error propagated.' },
        { src: 'img/blackbox-repair.webp', caption: 'Repair workspace: the fix, replayed and verified.' },
      ],
      stack: [
        { group: 'AI / ML', items: ['PyTorch', 'Graph Neural Networks', 'LLM Agents', 'Groq API', 'Ollama'] },
        { group: 'Backend', items: ['Python', 'FastAPI', 'OpenTelemetry'] },
        { group: 'Quality', items: ['Pytest (29 tests)', 'Render'] },
      ],
      challenges: [
        'Finding the cause, not the symptom: the step where an error surfaces is rarely the one that introduced it.',
        'Generalising to new failures — the GNN is evaluated on fault types it never saw in training.',
        'Replaying cheaply: event-sourced checkpoints so a fix doesn’t mean re-running every model call.',
      ],
      learned: [
        'Treating agent runs as graphs makes error propagation learnable.',
        'Observability standards (OpenTelemetry) make a tool plug into real agents instead of a toy demo.',
      ],
      results: [
        { value: '93.1%', label: 'Top-1 root-cause accuracy', how: 'synthetic benchmark of 5,000 runs · gradient boosting 89.6% · rule baseline 65.7%' },
        { value: '88.4%', label: 'Top-1 accuracy on unseen fault types', how: 'held-out fault types, synthetic benchmark' },
        { value: '34%', label: 'Steps re-executed per replay', how: 'average; 66% of steps reused from checkpoints' },
        { value: '90.9%', label: 'Failures fixed by repairing the #1 suspect', how: '98.1% within 3 replays, synthetic benchmark' },
        { value: '29', label: 'Pytest tests' },
      ],
      resultsNote: 'Experimental results on a synthetic benchmark (data/metrics.json in the repository) — not production performance.',
    },
  },
  {
    slug: 'cardioguard',
    index: '03',
    name: 'CardioGuard',
    tagline: 'Explainable AI for Heart-Disease Risk Screening',
    description:
      'An offline-first heart-risk screening app for community health workers: an XGBoost model with interpretable predictions, an in-browser risk model that works without internet, Hindi/English UI, OCR of lab reports and PDF reports.',
    long:
      'Built for ASHA community health workers who screen people where connectivity is poor. It started with a lesson in honesty: a popular dataset gave a too-good 97% accuracy that turned out to be duplicate-row leakage, so the pipeline was rebuilt on clean data before anything shipped.',
    year: 'Sep 2026',
    tech: ['Python', 'XGBoost', 'Scikit-Learn', 'FastAPI', 'React', 'PWA'],
    github: 'https://github.com/Tanishqtiwari1/CardioGuard',
    live: 'https://tanishqtiwari1.github.io/CardioGuard/',
    image: 'img/cardioguard.webp',
    stats: [
      { value: '82.1%', label: 'Accuracy', how: 'held-out test set, 184 patients' },
      { value: '0.915', label: 'ROC-AUC', how: 'same held-out set' },
      { value: '83.9%', label: 'F1 score', how: 'same held-out set' },
    ],
    contribution: [
      'Trained and tuned the XGBoost classifier (grid search) on 918 real patients from the UCI Heart Disease database.',
      'Found data leakage in a popular Kaggle dataset (duplicate rows inflated accuracy to 97%) and rebuilt the preprocessing on clean data.',
      'Built the offline-first PWA for ASHA health workers: in-browser Framingham model, Hindi/English UI, lab-report OCR and PDF reports; automated deployment with GitHub Actions.',
    ],
    evaluation: {
      dataset: 'UCI Heart Disease database — 918 real patients from four hospitals (target: >50% narrowing on angiography). Framingham Heart Study teaching dataset (4,240 adults) for the no-blood-test home screening model.',
      method: 'Held-out test set of 184 patients the model never saw; 5-fold CV accuracy on training data 81.2% ± 3.5%. Framingham model: test ROC-AUC 0.705, 5-fold CV 0.732 ± 0.033.',
      limitations: [
        'A screening estimate, not a diagnosis.',
        'Everyone in the UCI data was referred for angiography, so symptom-free patients there had a high disease rate — the model can over-score symptom-free people.',
        'Framingham participants were mostly white Americans; risk may be underestimated for South Asians (the app warns about this).',
      ],
    },
    docs: [
      { label: 'README', href: 'https://github.com/Tanishqtiwari1/CardioGuard#readme' },
      { label: 'Model card', href: 'https://github.com/Tanishqtiwari1/CardioGuard/blob/main/MODEL_CARD.md' },
    ],
    study: {
      problem: [
        'Cardiovascular risk screening often happens where connectivity is poor and specialists are scarce. A prediction is only useful to a health worker if it works on the device and explains itself.',
      ],
      solution: [
        'An offline-first Progressive Web App for community health (ASHA) workers: screenings run in the browser, predictions are explained, lab reports are read with OCR, and results sync when the internet returns — in Hindi or English.',
      ],
      howItWorks: [
        { title: 'Catch the leakage', body: 'A popular Kaggle dataset produced 97% accuracy because duplicate rows leaked between train and test (only 302 of 1,025 rows were unique). The preprocessing pipeline was rebuilt on clean, de-duplicated data.' },
        { title: 'Tuned XGBoost', body: 'An XGBoost classifier with grid-search hyperparameter tuning on 918 real patients (UCI Heart Disease), evaluated on a held-out test set.' },
        { title: 'Works offline', body: 'An in-browser Framingham risk model (4,240 adults, 0.73 cross-validated ROC-AUC) lets screenings run with no connection at all.' },
        { title: 'Built for the field', body: 'Hindi/English UI, OCR of lab reports, PDF report generation, and automated deployment with GitHub Actions.' },
      ],
      pipeline: {
        caption: 'From raw dataset to an explained prediction on the health worker’s device.',
        nodes: [
          { label: 'Raw dataset', sub: '1,025 rows' },
          { label: 'De-duplicate', sub: '918 clean records' },
          { label: 'Grid search', sub: 'XGBoost' },
          { label: 'Evaluate', sub: 'held-out test' },
          { label: 'Serve', sub: 'FastAPI + PWA' },
        ],
      },
      gallery: [{ src: 'img/cardioguard.webp', caption: 'Live risk estimate with drag-to-explore sliders.', wide: true }],
      stack: [
        { group: 'AI / ML', items: ['XGBoost', 'Scikit-Learn', 'OCR'] },
        { group: 'Backend', items: ['Python', 'FastAPI', 'SQLAlchemy', 'Pytest'] },
        { group: 'Frontend', items: ['React', 'PWA'] },
        { group: 'Infra', items: ['GitHub Actions', 'GitHub Pages'] },
      ],
      challenges: [
        'A too-good-to-be-true 97% accuracy that turned out to be data leakage from duplicate rows.',
        'Making screenings work with no connectivity and syncing safely afterwards.',
      ],
      learned: [
        'Always question a great metric before trusting it — check the data first.',
        'In healthcare, a model people can understand beats a slightly better black box.',
      ],
      results: [
        { value: '82.1%', label: 'Accuracy', how: 'held-out test set of 184 patients · CV 81.2% ± 3.5%' },
        { value: '83.9%', label: 'F1 score', how: 'same held-out set' },
        { value: '0.915', label: 'ROC-AUC', how: 'same held-out set' },
        { value: '0.73', label: 'CV ROC-AUC, offline Framingham model', how: '5-fold CV on 4,240 adults · test ROC-AUC 0.705' },
      ],
      resultsNote: 'Experimental results on public research datasets — not clinical validation.',
    },
  },
  {
    slug: 'guildspace',
    index: '04',
    name: 'Guildspace',
    tagline: 'Community Skill Exchange & Mentorship Platform',
    description:
      'A peer-to-peer platform where students trade practical skills, get matched with compatible mentors and stay connected with their faculty — with time-banked skill credits, reliability scores and a privacy-first academics module.',
    long:
      'Learn something, teach something. Students list what they can teach and want to learn; mentors are ranked by skill fit, shared free time, interaction mode, location and ratings. One hour taught earns one credit, held in escrow until both sides confirm the session happened. Faculty run courses, extra classes, announcements and marks — with marks privacy enforced in the backend, not the UI.',
    year: 'Oct 2026',
    tech: ['React', 'FastAPI', 'SQLAlchemy', 'SQLite', 'Python', 'Pytest'],
    github: 'https://github.com/Tanishqtiwari1/Guildspace',
    live: 'https://tanishqtiwari1.github.io/Guildspace/',
    image: 'img/guildspace.webp',
    // TODO(Tanishq): add `contribution` — what you personally built in Guildspace (it isn't on your resume, so it's left out rather than guessed).
    docs: [
      { label: 'README', href: 'https://github.com/Tanishqtiwari1/Guildspace#readme' },
      { label: 'Faculty & academics module', href: 'https://github.com/Tanishqtiwari1/Guildspace#faculty--academic-module' },
    ],
    study: {
      problem: [
        'Students have skills worth sharing and gaps they want to fill, but finding a compatible peer mentor — with matching skills, free time and trust — is left to chance. Faculty updates are scattered across groups and notice boards.',
      ],
      solution: [
        'Guildspace puts peer learning and faculty connection in one place: reciprocity-based mentor matching, a time-banking credit system that pays mentors only after a confirmed session, reliability scores, and an academics hub for courses, extra classes, announcements and private marks.',
      ],
      howItWorks: [
        { title: 'Reciprocity matching', body: 'Mentors are ranked by skill fit, shared free time, interaction mode, location and ratings — every score computed from database records at request time.' },
        { title: 'Skill credits', body: '1 hour taught = 1 credit. Scheduling puts the learner’s credits on hold; the mentor is paid only after both confirm. Cancellations and no-shows refund. The ledger is append-only.' },
        { title: 'Faculty module', body: 'Verified faculty create courses, schedule extra classes (room and time clashes are rejected), send targeted announcements and publish marks with a full audit log.' },
        { title: 'Privacy by design', body: 'Students can only ever query their own published marks; requests for anything else return the same 404 as a missing record. Tests cover these attack cases.' },
      ],
      architecture: {
        caption: 'React frontend on GitHub Pages; FastAPI backend on Render. Optional AI features fall back to rule-based generators.',
        nodes: [
          { label: 'React', sub: 'web frontend' },
          { label: 'REST API', sub: 'FastAPI' },
          { label: 'SQLAlchemy', sub: 'ORM' },
          { label: 'SQLite', sub: 'records + ledger' },
        ],
      },
      gallery: [{ src: 'img/guildspace.webp', caption: 'Learn something. Teach something. Grow together.', wide: true }],
      stack: [
        { group: 'Frontend', items: ['React', 'JavaScript', 'GitHub Pages'] },
        { group: 'Backend', items: ['Python', 'FastAPI', 'SQLAlchemy', 'SQLite'] },
        { group: 'Quality', items: ['Pytest', 'GitHub Actions', 'Render'] },
      ],
      challenges: [
        'Designing a fair credit system — escrow until both sides confirm, refunds for no-shows, and an append-only ledger.',
        'Enforcing marks privacy on the server so no UI bug can ever leak another student’s result.',
      ],
      learned: [
        'Trust features (credits, reliability, audit logs) matter as much as the core matching.',
        'Writing the SRS first made a large feature set tractable.',
      ],
    },
  },
]

export const mainProjects = projects.filter((p) => !p.archive)
export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)

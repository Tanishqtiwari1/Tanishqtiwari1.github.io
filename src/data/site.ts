/**
 * Single source of truth for site content.
 * Edit this file (and projects.ts) to update the website — no component changes needed.
 */

export const profile = {
  name: 'Tanishq Tewari',
  short: 'Tanishq',
  title: 'AI/ML Engineer · Software Developer',
  positioning: ['AI/ML', 'Software Engineering', 'Full Stack', 'Problem Solving'],
  tagline:
    'I build intelligent systems and software products that turn real-world problems into working solutions.',
  location: 'India',
  timezone: 'Asia/Kolkata',
  education: {
    degree: 'B.Tech Computer Science & Engineering',
    school: 'Manipal University Jaipur',
  },
}

export const links = {
  github: 'https://github.com/Tanishqtiwari1',
  githubUser: 'Tanishqtiwari1',
  linkedin: 'https://www.linkedin.com/in/tanishqtiwari-aiml',
  email: 'tanishqtiwari9911@gmail.com',
  resume: `${import.meta.env.BASE_URL}Tanishq_Tewari_Resume.pdf`,
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  paragraphs: [
    "I'm Tanishq — a B.Tech Computer Science (AI & ML) student at Manipal University Jaipur who likes building AI systems that actually ship, not just notebooks that score well.",
    'I enjoy taking ideas from problem statement → architecture → implementation → deployment. My recent work includes a graph neural network that debugs LLM agents, a multilingual NLP platform that triages civic complaints for city officers, an offline-first heart-risk screening app for health workers, and a skill-exchange platform for students.',
    'Along the way I completed a 2-month in-campus AI & ML program at IIT Mandi (deep learning, CNNs, NLP, deployment) and led Team Codestorm to 2nd place at the OFFGRID Hackathon. I care about honest metrics, explainable models and products real people can use.',
  ],
  currently: [
    { label: 'Studying', value: 'B.Tech CSE (AI & ML)', sub: 'Manipal University Jaipur · 2024 – 2028' },
    { label: 'Focus', value: 'AI/ML · Software Engineering · Full Stack' },
    { label: 'Building', value: 'AI-powered products & intelligent systems' },
    { label: 'Seeking', value: 'Software Engineering & AI/ML internships' },
  ],
  pipeline: ['Problem', 'Architecture', 'Implementation', 'Deployment'],
}

export const highlights: { big: string; unit: string; title: string; meta: string; img?: string; href?: string }[] = [
  { big: '2nd', unit: 'Place', title: 'OFFGRID Hackathon', meta: 'TechIdeate 2026 · IEEE SB MUJ · Team lead', img: 'img/offgrid-award.jpg', href: '/work/galligraph' },
  { big: 'AI/ML', unit: 'Intern', title: 'HCLTech', meta: 'Dec 2026 – Jan 2027' },
  { big: 'IIT', unit: 'Mandi', title: 'AI & ML In-Campus Program', meta: 'Himshikhar 2026 · May – Jul 2026', img: 'img/iit-mandi-focus.jpg' },
  { big: '93.1%', unit: '', title: 'Root-cause accuracy', meta: 'Black Box GNN vs 65.7% baseline', img: 'img/blackbox.jpg', href: '/work/blackbox' },
]

export type TimelineEntry = {
  org: string
  role: string
  period: string
  /** ISO-ish start date, used to show an "Upcoming" badge automatically. */
  start: string
  kind: 'Work' | 'Award' | 'Community' | 'Learning' | 'Hackathon'
  meta?: string
  details: string[]
  tags: string[]
  /** Optional photo (public/img) shown on hover and when the entry is expanded. */
  image?: { src: string; alt: string }
}

export const timeline: TimelineEntry[] = [
  {
    org: 'HCLTech',
    role: 'AI/ML Intern',
    period: 'Dec 2026 – Jan 2027',
    start: '2026-12-01',
    kind: 'Work',
    details: ['AI/ML internship at HCLTech. Responsibilities and outcomes will be added here once the internship is underway.'],
    tags: ['AI/ML', 'Internship'],
  },
  {
    org: 'IIT Mandi',
    role: 'AI & ML In-Campus Program',
    period: 'May 2026 – Jul 2026',
    start: '2026-05-01',
    kind: 'Learning',
    meta: 'Himshikhar 2026 · Summer Residential Program',
    image: { src: 'img/iit-mandi-focus.jpg', alt: 'Tanishq Tewari holding his Himshikhar 2026 certificate of completion in front of the IIT Mandi administrative building' },
    details: [
      'Completed the 2-month in-campus Artificial Intelligence & Machine Learning program (Himshikhar 2026 Summer Residential Program) at IIT Mandi, with a certificate of completion.',
      'Covered supervised learning, deep learning, convolutional neural networks (CNNs), NLP and model deployment.',
    ],
    tags: ['Deep Learning', 'CNNs', 'NLP', 'Deployment'],
  },
  {
    org: "BNB'26 CodeStorm",
    role: 'Hackathon · Built Black Box',
    period: 'Oct 2026',
    start: '2026-10-01',
    kind: 'Hackathon',
    meta: 'GDG on Campus',
    details: [
      'Built Black Box — a flight recorder and debugger for AI agents that finds the root cause of a failed run with a graph neural network and replays from that step to verify the fix.',
    ],
    tags: ['Black Box', 'PyTorch', 'GNN', 'OpenTelemetry'],
  },
  {
    org: 'OFFGRID Hackathon',
    role: '2nd Place',
    period: 'Oct 2026',
    start: '2026-10-01',
    kind: 'Award',
    meta: 'IEEE Student Branch MUJ · Techideate 2026',
    details: [
      'Led Team Codestorm to 2nd Position and a ₹15,000 prize.',
      'Built GalliGraph — an AI triage system that turns messy civic complaints in English, Hindi and Hinglish into a ranked, de-duplicated, routed work queue.',
    ],
    tags: ['GalliGraph', 'NLP', 'FastAPI', 'React'],
    image: { src: 'img/offgrid-award.jpg', alt: 'Team Codestorm receiving the OFFGRID 2nd Position award on stage at TechIdeate 2026' },
  },
  {
    org: 'Aperture',
    role: 'Working Team',
    period: 'MUJ',
    start: '',
    kind: 'Community',
    meta: 'Digital Arts Society · Manipal University Jaipur',
    details: ["Part of the working team at Aperture, MUJ's digital arts society — photography, videography and visual storytelling."],
    tags: ['Photography', 'Videography', 'Creative'],
  },
]

export const stack: { group: string; note: string; items: string[] }[] = [
  { group: 'Languages', note: 'What I think in', items: ['Python', 'C++', 'Java', 'C', 'SQL', 'JavaScript', 'TypeScript'] },
  { group: 'AI / ML', note: 'Models, training & evaluation', items: ['Machine Learning', 'Deep Learning', 'NLP', 'Graph Neural Networks', 'LLM Agents', 'PyTorch', 'Scikit-Learn', 'XGBoost', 'Random Forest', 'SHAP', 'OCR'] },
  { group: 'Backend', note: 'APIs & services', items: ['FastAPI', 'REST APIs', 'Node.js', 'Express', 'OpenTelemetry', 'RBAC & Auth'] },
  { group: 'Frontend', note: 'Interfaces people use', items: ['React', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'PWA'] },
  { group: 'Data', note: 'Where data lives & gets shaped', items: ['SQLite', 'MySQL', 'MongoDB', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'] },
  { group: 'Tools & Deploy', note: 'Getting it live', items: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'Pytest', 'Postman', 'Render', 'Vercel', 'Netlify', 'GitHub Pages', 'Ollama', 'Groq API'] },
]

export type Hackathon = {
  name: string
  edition: string
  host: string
  result: string
  team?: string[]
  project: string
  projectSlug?: string
}

/** Add future hackathons to this list — newest first. */
export const hackathons: Hackathon[] = [
  {
    name: 'OFFGRID Hackathon',
    edition: 'TechIdeate 2026',
    host: 'IEEE Student Branch · Manipal University Jaipur',
    result: '🥈 2nd Position',
    team: ['Team Codestorm · Tanishq Tewari (lead)'],
    project: 'GalliGraph',
    projectSlug: 'galligraph',
  },
  {
    name: "BNB'26 CodeStorm",
    edition: 'Oct 2026',
    host: 'GDG on Campus',
    result: 'Built Black Box',
    project: 'Black Box',
    projectSlug: 'blackbox',
  },
]

/** NOW // what I'm working on — edit freely. */
export const now = {
  updated: 'Nov 2026',
  items: [
    { title: 'AI/ML Engineering', note: 'Models that ship, not just notebooks.' },
    { title: 'Full-stack development', note: 'End-to-end products with clean APIs.' },
    { title: 'DSA & problem solving', note: 'Arrays, trees, graphs, DP — daily reps.' },
    { title: 'Real-world AI products', note: 'Civic tech, health, mobility.' },
    { title: 'Agentic AI', note: 'Tool-using systems and how to debug them.' },
    { title: 'Hackathons & open source', note: 'Shipping under pressure, in public.' },
  ],
}

export const beyond = [
  { title: 'Photography', note: 'Light, framing, patience.', icon: '◉' },
  { title: 'Videography', note: 'Stories in motion.', icon: '▶' },
  { title: 'Creative Technology', note: 'Where code meets craft.', icon: '✦' },
  { title: 'Aperture', note: 'Digital Arts Society, MUJ.', icon: '◎' },
  { title: 'Hackathons', note: 'Ideas under a deadline.', icon: '⚑' },
]

/** Instagram post where Tanishq is featured — shown as a local, interactive recreation (no external links). */
export const featuredPost = {
  account: 'muj.techideate',
  followers: '1,412 followers',
  avatar: 'img/ig/avatar.jpg',
  slides: [1, 2, 3, 4, 5, 6].map((n) => `img/ig/slide-${n}.jpg`),
  /** 1-based slide where Tanishq appears; the post opens here. */
  mySlide: 5,
  likes: 111,
  title: 'Featured by TechIdeate, MUJ',
  quote: 'Celebrating innovation, creativity, and excellence!',
  note: 'The official TechIdeate account at Manipal University Jaipur featured the OFFGRID winners. The post opens on slide 5 — that’s Team Codestorm receiving 2nd Position.',
}

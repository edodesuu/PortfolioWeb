// ═══════════════════════════════════════
// Data Store — localStorage + defaults
// ═══════════════════════════════════════

export interface Project {
  id: string;
  title: string;
  description: string;
  badge?: string;
  tags: string[];
  screenshots: string[]; // file paths (from assets) or base64 data URIs
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface TechCategory {
  label: string;
  items: string[];
}

const PROJECTS_KEY = 'portfolio_projects';
const TECH_KEY = 'portfolio_tech';

// ─── Default Data ──────────────────────

const defaultProjects: Project[] = [
  {
    id: 'bot-zadaniye',
    title: 'Bot Zadaniye',
    badge: 'Open Source',
    description: 'A Telegram bot for task distribution — primarily for advertising services like "Like this, subscribe to that." Features smart subscription & like tracking to prevent fraud, a fair penalty system for violators, an admin panel, and a gamification module.',
    tags: ['Python', 'aiogram', 'PostgreSQL', 'Docker'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'realtor-bot',
    title: 'Realtor Bot',
    badge: 'Commercial',
    description: 'A real-estate Telegram bot with a massive property database. Admins add listings via the admin panel; users find properties through an advanced multi-filter search. When a user is interested, the bot connects them directly with an admin for discussion.',
    tags: ['Python', 'aiogram', 'PostgreSQL', 'Admin Panel'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'scanner-bot',
    title: 'Scanner Bot',
    badge: 'Private',
    description: 'A stealth bot with userbot integration designed to infiltrate neighborhood groups and find potential clients via keyword monitoring. Disguised as a real user, it continuously scans group messages and forwards matches to a dedicated channel.',
    tags: ['Python', 'Telethon', 'Userbot', 'Regex'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'auth-landing',
    title: 'Auth Landing Page',
    badge: 'Full Stack',
    description: 'A full-stack web application with real Gmail OAuth authentication. A landing page presenting specialized software with a complete auth flow and user management.',
    tags: ['React', 'TypeScript', 'Node.js', 'OAuth'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
];

const defaultTech: TechCategory[] = [
  { label: 'Telegram Bots', items: ['Python', 'Aiogram', 'Telebot', 'Telethon', 'yt-dlp', 'Pyrogram'] },
  { label: 'Front-End', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'TailwindCSS'] },
  { label: 'Back-End', items: ['Flask', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'REST API'] },
  { label: 'Tools', items: ['Git', 'Docker', 'Linux', 'Bash', 'Nginx', 'Networks', 'CI/CD'] },
];

// ─── Projects ──────────────────────────

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // First time — save defaults
  saveProjects(defaultProjects);
  return defaultProjects;
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter(p => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

// ─── Tech Stack ────────────────────────

export function getTechStack(): TechCategory[] {
  try {
    const raw = localStorage.getItem(TECH_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  saveTechStack(defaultTech);
  return defaultTech;
}

export function saveTechStack(tech: TechCategory[]): void {
  localStorage.setItem(TECH_KEY, JSON.stringify(tech));
}

// ─── Auth ──────────────────────────────

const ADMIN_PASSWORD = '29052004Claymoris';

export function checkAdminAuth(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem('admin_auth') === 'true';
}

export function setAdminAuth(): void {
  sessionStorage.setItem('admin_auth', 'true');
}

// ─── ID Generator ──────────────────────

export function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `project-${Date.now()}`;
}

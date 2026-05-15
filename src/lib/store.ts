// ═══════════════════════════════════════
// Data Store — localStorage + i18n
// ═══════════════════════════════════════

export interface Project {
  id: string;
  title: string;
  title_ru: string;
  description: string;
  description_ru: string;
  badge?: string;
  tags: string[];
  screenshots: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface TechCategory {
  label: string;
  items: string[];
}

const PROJECTS_KEY = 'portfolio_projects_v2';
const TECH_KEY = 'portfolio_tech';

// Helper to get localized field
export function localized(project: Project, field: 'title' | 'description', lang: string): string {
  if (lang === 'ru') {
    const ruField = project[`${field}_ru` as keyof Project] as string;
    return ruField || project[field];
  }
  return project[field];
}

// ─── Default Data ──────────────────────

const defaultProjects: Project[] = [
  {
    id: 'bot-zadaniye',
    title: 'Bot Zadaniye',
    title_ru: 'Бот Заданий',
    badge: 'Open Source',
    description: 'A Telegram bot for task distribution — primarily for advertising services like "Like this, subscribe to that." Features smart subscription & like tracking to prevent fraud, a fair penalty system for violators, an admin panel, and a gamification module.',
    description_ru: 'Telegram-бот для распределения заданий — в основном для рекламных сервисов типа "Лайкни, подпишись." Умное отслеживание подписок и лайков для предотвращения мошенничества, справедливая система штрафов, админ-панель и модуль геймификации.',
    tags: ['Python', 'aiogram', 'PostgreSQL', 'Docker'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'realtor-bot',
    title: 'Realtor Bot',
    title_ru: 'Бот Риелтор',
    badge: 'Commercial',
    description: 'A real-estate Telegram bot with a massive property database. Admins add listings via the admin panel; users find properties through an advanced multi-filter search. When a user is interested, the bot connects them directly with an admin for discussion.',
    description_ru: 'Telegram-бот для недвижимости с огромной базой объектов. Админы добавляют объявления через панель; пользователи ищут через продвинутый мульти-фильтр. Когда пользователь заинтересован, бот связывает его напрямую с админом.',
    tags: ['Python', 'aiogram', 'PostgreSQL', 'Admin Panel'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'scanner-bot',
    title: 'Scanner Bot',
    title_ru: 'Бот Сканер',
    badge: 'Private',
    description: 'A stealth bot with userbot integration designed to infiltrate neighborhood groups and find potential clients via keyword monitoring. Disguised as a real user, it continuously scans group messages and forwards matches to a dedicated channel.',
    description_ru: 'Стелс-бот с интеграцией юзербота для проникновения в группы районов и поиска потенциальных клиентов через мониторинг ключевых слов. Замаскирован под реального пользователя, непрерывно сканирует сообщения и пересылает совпадения в канал.',
    tags: ['Python', 'Telethon', 'Userbot', 'Regex'],
    screenshots: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'auth-landing',
    title: 'Auth Landing Page',
    title_ru: 'Лендинг с авторизацией',
    badge: 'Full Stack',
    description: 'A full-stack web application with real Gmail OAuth authentication. A landing page presenting specialized software with a complete auth flow and user management.',
    description_ru: 'Фулл-стек веб-приложение с реальной Gmail OAuth авторизацией. Лендинг-страница со специализированным ПО, полным потоком авторизации и управлением пользователями.',
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

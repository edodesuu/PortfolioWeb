import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════

export interface Project {
  id: string;
  title: string;
  title_ru: string;
  description: string;
  description_ru: string;
  badge?: string;
  tags: string[];
  cover?: string;
  screenshots: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface TechCategory {
  label: string;
  items: string[];
}

export function localized(project: Project, field: 'title' | 'description', lang: string): string {
  if (lang === 'ru') {
    const ruField = project[`${field}_ru` as keyof Project] as string;
    return ruField || project[field];
  }
  return project[field];
}

// ─── Default Data (fallback) ───────────

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
    cover: '',
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
    cover: '',
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
    cover: '',
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
    cover: '',
    githubUrl: '',
    liveUrl: '',
    featured: true,
  }
];

const defaultTech: TechCategory[] = [
  { label: 'Telegram Bots', items: ['Python', 'Aiogram', 'Telebot', 'Telethon', 'yt-dlp', 'Pyrogram'] },
  { label: 'Front-End', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'TailwindCSS'] },
  { label: 'Back-End', items: ['Flask', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'REST API'] },
  { label: 'Tools', items: ['Git', 'Docker', 'Linux', 'Bash', 'Nginx', 'Networks', 'CI/CD'] },
];

// ─── Context ───────────────────────────

interface PortfolioContextType {
  projects: Project[];
  techStack: TechCategory[];
  loading: boolean;
  saveProjects: (projects: Project[]) => Promise<void>;
  saveTechStack: (tech: TechCategory[]) => Promise<void>;
  uploadImage: (base64OrUrl: string, path: string) => Promise<string>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        
        // Firebase getDoc can hang indefinitely if the database doesn't exist or is blocked.
        // We use Promise.race to enforce a 5-second timeout.
        const snap = await Promise.race([
          getDoc(docRef),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000))
        ]);
        
        if (snap.exists()) {
          const data = snap.data();
          setProjects(data.projects || defaultProjects);
          setTechStack(data.techStack || defaultTech);
        } else {
          // If no data in DB, save the defaults
          setProjects(defaultProjects);
          setTechStack(defaultTech);
          await setDoc(docRef, { projects: defaultProjects, techStack: defaultTech });
        }
      } catch (err) {
        console.error("Failed to load from Firebase, falling back to defaults", err);
        setProjects(defaultProjects);
        setTechStack(defaultTech);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    await setDoc(doc(db, 'portfolio', 'data'), { projects: newProjects }, { merge: true });
  };

  const handleSaveTechStack = async (newTech: TechCategory[]) => {
    setTechStack(newTech);
    await setDoc(doc(db, 'portfolio', 'data'), { techStack: newTech }, { merge: true });
  };

  const uploadImage = async (base64OrUrl: string, path: string): Promise<string> => {
    // If it's already a URL, just return it
    if (!base64OrUrl.startsWith('data:image')) return base64OrUrl;
    
    // Upload base64 to Firebase Storage
    const imageRef = ref(storage, path);
    
    try {
      await Promise.race([
        uploadString(imageRef, base64OrUrl, 'data_url'),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Storage upload timeout")), 15000))
      ]);
      
      const url = await Promise.race([
        getDownloadURL(imageRef),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Storage URL timeout")), 5000))
      ]);
      
      return url;
    } catch (err) {
      console.error("Image upload failed:", err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      projects, techStack, loading,
      saveProjects: handleSaveProjects,
      saveTechStack: handleSaveTechStack,
      uploadImage
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

// ─── Auth (Local) ──────────────────────
const ADMIN_PASSWORD = '29052004Claymoris';
export function checkAdminAuth(password: string): boolean { return password === ADMIN_PASSWORD; }
export function isAdminAuthed(): boolean { return sessionStorage.getItem('admin_auth') === 'true'; }
export function setAdminAuth(): void { sessionStorage.setItem('admin_auth', 'true'); }
export function generateId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `project-${Date.now()}`;
}

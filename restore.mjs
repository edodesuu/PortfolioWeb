import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHa2hFY8XB4HzpZCfRth11rf6LwHeimbw",
  authDomain: "portfolioweb-96318.firebaseapp.com",
  projectId: "portfolioweb-96318",
  storageBucket: "portfolioweb-96318.firebasestorage.app",
  messagingSenderId: "303917098988",
  appId: "1:303917098988:web:4e163bc0e4c7992dc0c2c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultProjects = [
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

const defaultTech = [
  { label: 'Telegram Bots', items: ['Python', 'Aiogram', 'Telebot', 'Telethon', 'yt-dlp', 'Pyrogram'] },
  { label: 'Front-End', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'TailwindCSS'] },
  { label: 'Back-End', items: ['Flask', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'REST API'] },
  { label: 'Tools', items: ['Git', 'Docker', 'Linux', 'Bash', 'Nginx', 'Networks', 'CI/CD'] },
];

async function run() {
  try {
    const docRef = doc(db, 'portfolio', 'data');
    const snap = await getDoc(docRef);
    const data = snap.exists() ? snap.data() : {};
    data.projects = defaultProjects;
    data.techStack = defaultTech;
    await setDoc(docRef, data);
    console.log("Restored successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

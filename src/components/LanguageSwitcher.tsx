import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const toggle = () => {
    i18n.changeLanguage(isEn ? 'ru' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-3 py-1.5 cursor-pointer group"
    >
      <span className={`text-xs tracking-[0.25em] uppercase transition-all duration-500 ${isEn ? 'text-white font-medium' : 'text-white/20'}`}>
        EN
      </span>
      <span className="w-4 h-px bg-white/20" />
      <span className={`text-xs tracking-[0.25em] uppercase transition-all duration-500 ${!isEn ? 'text-white font-medium' : 'text-white/20'}`}>
        RU
      </span>
    </button>
  );
}

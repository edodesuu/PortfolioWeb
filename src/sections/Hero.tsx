import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer } from '../lib/animations';
import TerminalBackground from '../components/TerminalBackground';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Terminal boot sequence background */}
      <TerminalBackground />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1,
      }} />

      {/* Content */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem', maxWidth: '720px', margin: '0 auto' }}>

        {/* Name */}
        <motion.h1 variants={fadeInUp} className="font-display"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          CLAYMORE
        </motion.h1>

        {/* Role */}
        <motion.p variants={fadeInUp}
          style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginBottom: '1.5rem' }}>
          {t('hero.role')}
        </motion.p>

        {/* Subtitle */}
        <motion.p variants={fadeInUp}
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 3rem', lineHeight: 1.8 }}>
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 40px', background: '#fff', color: '#000', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity 0.3s' }}>
            {t('hero.cta_projects')}
          </button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 40px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, background: 'transparent', cursor: 'pointer', transition: 'all 0.3s' }}>
            {t('hero.cta_contact')}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1.5 }}
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)', fontWeight: 500 }}>scroll</span>
        <div className="animate-scroll-hint" style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)' }} />
      </motion.div>
    </section>
  );
}

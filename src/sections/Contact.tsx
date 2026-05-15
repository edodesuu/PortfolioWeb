import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

const socials = [
  { key: 'telegram', href: 'https://t.me/vagabondideology', handle: '@vagabondideology' },
  { key: 'github', href: 'https://github.com/edodesuu', handle: 'edodesuu' },
  { key: 'discord', href: '#', handle: 'nocturnaldoto' },
];

export default function Contact() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id="contact" label={t('contact.label')} title={t('contact.title')}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem' }}>
        {/* Left */}
        <div>
          <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', lineHeight: 1.9, marginBottom: '2.5rem' }}>
            {t('contact.description')}
          </motion.p>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <a href="https://t.me/vagabondideology" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 40px', background: '#fff', color: '#000', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.3s' }}>
              {t('contact.cta')} <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          {socials.map((social) => (
            <motion.a key={social.key} variants={staggerItem} href={social.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'background 0.5s' }}
              className="hover:bg-white/[0.01]">
              <div>
                <span style={{ display: 'block', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 500, marginBottom: '4px' }}>
                  {t(`contact.${social.key}`)}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  {social.handle}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.1rem' }}>→</span>
            </motion.a>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

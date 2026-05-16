import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

export default function Services() {
  const { t } = useTranslation();
  const items = t('services.items', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <SectionWrapper id="services" label={t('services.label')} title={t('services.title')}>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
        {items.map((item, i) => (
          <motion.div key={i} variants={staggerItem}
            style={{ padding: '2.5rem', cursor: 'default', position: 'relative' }}
            className="neon-border group">
            
            <span className="font-mono neon-text" style={{ fontSize: '12px', display: 'block', marginBottom: '1.5rem' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            
            <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {item.title}
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

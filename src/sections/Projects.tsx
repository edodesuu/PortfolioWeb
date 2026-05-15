import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

export default function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Array<{
    title: string; description: string; tags: string[]; badge?: string;
  }>;

  return (
    <SectionWrapper id="projects" label={t('projects.label')} title={t('projects.title')}>
      {/* Centered subtitle */}
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '3rem' }}>
        {items.map((project, i) => (
          <motion.div key={i} variants={staggerItem}
            className="group"
            style={{ border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.5s', overflow: 'hidden' }}>
            {/* Image */}
            <div style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="enso" style={{ width: '60px', height: '60px', opacity: 0.2 }} />
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {project.badge && (
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'inline-block', marginBottom: '0.75rem', fontWeight: 500 }}>
                  {project.badge}
                </span>
              )}
              <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.75rem' }}>
                {project.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 12px', fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

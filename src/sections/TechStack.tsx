import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { fadeInUp, viewportConfig } from '../lib/animations';
import { getTechStack } from '../lib/store';

export default function TechStack() {
  const { t } = useTranslation();
  const categories = getTechStack();

  const allTech = categories.flatMap(c => c.items);
  const row1 = [...allTech, ...allTech];
  const row2Src = [...allTech].reverse();
  const row2 = [...row2Src, ...row2Src];

  return (
    <SectionWrapper id="tech" label={t('tech.label')} title={t('tech.title')}>
      {/* Category grid */}
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {categories.map((cat) => (
          <div key={cat.label}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
              {cat.label}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cat.items.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      {/* Marquee */}
      <div style={{ overflow: 'hidden', position: 'relative', marginBottom: '12px', marginLeft: '-2rem', marginRight: '-2rem' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, #000, transparent)', zIndex: 1 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to left, #000, transparent)', zIndex: 1 }} />
        <div className="animate-marquee" style={{ display: 'flex' }}>
          {row1.map((tech, i) => (
            <div key={i} style={{ flexShrink: 0, margin: '0 6px' }}>
              <div style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {tech}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ overflow: 'hidden', position: 'relative', marginLeft: '-2rem', marginRight: '-2rem' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, #000, transparent)', zIndex: 1 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to left, #000, transparent)', zIndex: 1 }} />
        <div className="animate-marquee" style={{ display: 'flex', animationDirection: 'reverse', animationDuration: '50s' }}>
          {row2.map((tech, i) => (
            <div key={i} style={{ flexShrink: 0, margin: '0 6px' }}>
              <div style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {tech}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

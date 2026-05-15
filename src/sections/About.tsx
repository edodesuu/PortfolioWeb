import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 15, suffix: '+', key: 'technologies' },
  { value: 4, suffix: '', key: 'projects' },
  { value: 6, suffix: '+', key: 'containers' },
  { value: 4, suffix: '', key: 'bots' },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id="about" label={t('about.label')} title={t('about.title')}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem' }}>
        {/* Text */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 2 }}>
            {t('about.description')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {stats.map((stat) => (
            <motion.div key={stat.key} variants={staggerItem}>
              <div className="font-display" style={{ fontSize: '2.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                {t(`about.stats.${stat.key}`)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

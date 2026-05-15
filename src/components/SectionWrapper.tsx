import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '../lib/animations';

interface SectionWrapperProps {
  id: string;
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({
  id,
  label,
  title,
  children,
  className = '',
}: SectionWrapperProps) {
  return (
    <section id={id} className={`w-full ${className}`}>
      {/* Divider */}
      <div className="section-container">
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Content */}
      <div className="section-container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        {(label || title) && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ marginBottom: '4rem' }}
          >
            {label && (
              <p style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginBottom: '1rem' }}>
                {label}
              </p>
            )}
            {title && (
              <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2 }}>
                {title}
              </h2>
            )}
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
}

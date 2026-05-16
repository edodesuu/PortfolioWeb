import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../components/SectionWrapper';
import { usePortfolio, localized } from '../lib/store';
import { staggerContainer, staggerItem, fadeInUp, viewportConfig } from '../lib/animations';

export default function Projects() {
  const { t, i18n } = useTranslation();
  const { projects, loading } = usePortfolio();
  const featuredProjects = projects.filter(p => p.featured);
  const lang = i18n.language;

  return (
    <SectionWrapper id="projects" label={t('projects.label')} title={t('projects.title')}>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2.5rem' }}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', gridColumn: '1 / -1' }}>Loading projects...</p>
        ) : featuredProjects.map((project) => (
          <motion.div key={project.id} variants={staggerItem}>
            <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', transition: 'border-color 0.5s' }}
              className="group hover:border-white/[0.12]">
              <div style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                {project.cover ? (
                  <img src={project.cover} alt={localized(project, 'title', lang)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="enso" style={{ width: '60px', height: '60px', opacity: 0.2 }} />
                    </div>
                  </>
                )}
              </div>
              <div style={{ padding: '1.75rem' }}>
                {project.badge && (
                  <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'inline-block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {project.badge}
                  </span>
                )}
                <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
                  {localized(project, 'title', lang)}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
                  {localized(project, 'description', lang)}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.07)', padding: '3px 10px', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
        style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 40px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none', transition: 'all 0.3s' }}>
          {t('projects.all')} <span>→</span>
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}

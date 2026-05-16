import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import { usePortfolio, localized } from '../lib/store';
import { staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

export default function AllProjectsPage() {
  const { t, i18n } = useTranslation();
  const { projects, loading } = usePortfolio();
  const lang = i18n.language;

  return (
    <Layout>
      <Navbar />
      <section style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="section-container">
          <div style={{ marginBottom: '4rem' }}>
            <Link to="/" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
              ← {t('nav.home')}
            </Link>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
              {t('projects.all')}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem' }}>
              {projects.length} {t('projects.count')}
            </p>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2.5rem', paddingBottom: '6rem' }}>
            {projects.map((project) => (
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
                      <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'inline-block', marginBottom: '0.5rem', fontWeight: 500 }}>{project.badge}</span>
                    )}
                    <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
                      {localized(project, 'title', lang)}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {localized(project, 'description', lang)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}

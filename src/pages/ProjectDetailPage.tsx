import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import { getProjectById } from '../lib/store';
import { fadeInUp } from '../lib/animations';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <Layout>
        <Navbar />
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>
              Project not found
            </h1>
            <Link to="/" style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>
        </section>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      <section style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '6rem' }}>
        <div className="section-container">
          {/* Back */}
          <Link to="/" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '3rem' }}>
            ← Back
          </Link>

          {/* Header */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                {project.title}
              </h1>
              {project.badge && (
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 14px', fontWeight: 500 }}>
                  {project.badge}
                </span>
              )}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
              {project.tags.map((tag) => (
                <span key={tag} style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 14px', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
              style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: project.screenshots.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '1.5rem' }}>
                {project.screenshots.map((src, i) => (
                  <div key={i} style={{ aspectRatio: '16/10', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No screenshots placeholder */}
          {project.screenshots.length === 0 && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
              style={{ aspectRatio: '21/9', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '3rem', position: 'relative', overflow: 'hidden', maxHeight: '400px' }}>
              <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="enso" style={{ width: '80px', height: '80px', opacity: 0.15 }} />
              </div>
            </motion.div>
          )}

          {/* Description + Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem' }}>
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
                About this project
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', lineHeight: 2 }}>
                {project.description}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
                Links
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>
                    <span style={{ fontSize: '0.95rem' }}>GitHub Repository</span>
                    <span>→</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>
                    <span style={{ fontSize: '0.95rem' }}>Live Demo / Bot</span>
                    <span>→</span>
                  </a>
                )}
                {!project.githubUrl && !project.liveUrl && (
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)' }}>No public links available</p>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import { getProjects } from '../lib/store';
import { staggerContainer, staggerItem, viewportConfig } from '../lib/animations';

export default function AllProjectsPage() {
  const projects = getProjects();

  return (
    <Layout>
      <Navbar />
      <section style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="section-container">
          {/* Header */}
          <div style={{ marginBottom: '4rem' }}>
            <Link to="/" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
              ← Back
            </Link>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
              All Projects
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem' }}>
              {projects.length} projects
            </p>
          </div>

          {/* Grid */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2.5rem', paddingBottom: '6rem' }}>
            {projects.map((project) => (
              <motion.div key={project.id} variants={staggerItem}>
                <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', transition: 'border-color 0.5s' }}
                  className="group hover:border-white/[0.12]">
                  {/* Image */}
                  <div style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                    {project.screenshots.length > 0 ? (
                      <img src={project.screenshots[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="enso" style={{ width: '60px', height: '60px', opacity: 0.2 }} />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ padding: '1.75rem' }}>
                    {project.badge && (
                      <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'inline-block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {project.badge}
                      </span>
                    )}
                    <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
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
        </div>
      </section>
      <Footer />
    </Layout>
  );
}

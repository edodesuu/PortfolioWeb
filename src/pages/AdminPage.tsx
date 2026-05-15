import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  type Project, type TechCategory,
  getProjects, saveProjects, getTechStack, saveTechStack,
  checkAdminAuth, isAdminAuthed, setAdminAuth, generateId,
} from '../lib/store';

// ─── Styles ────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8e8', fontSize: '14px',
  fontFamily: 'Inter, sans-serif', outline: 'none',
};

const btnStyle: React.CSSProperties = {
  padding: '10px 24px', background: '#fff', color: '#000', fontSize: '12px',
  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
  border: 'none', cursor: 'pointer', transition: 'opacity 0.3s',
};

const btnOutline: React.CSSProperties = {
  ...btnStyle, background: 'transparent', color: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(255,255,255,0.15)',
};

const btnDanger: React.CSSProperties = {
  ...btnOutline, color: '#e84040', borderColor: 'rgba(232,64,64,0.3)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginBottom: '6px', display: 'block',
};

// ─── Login Gate ────────────────────────

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminAuth(pw)) { setAdminAuth(); onAuth(); }
    else setError(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '360px', padding: '0 2rem' }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', textAlign: 'center' }}>
          Admin
        </h1>
        <input
          type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Password" autoFocus
          style={{ ...inputStyle, marginBottom: '1rem', borderColor: error ? 'rgba(232,64,64,0.5)' : undefined }}
        />
        {error && <p style={{ fontSize: '12px', color: '#e84040', marginBottom: '1rem' }}>Wrong password</p>}
        <button type="submit" style={{ ...btnStyle, width: '100%' }}>Enter</button>
      </form>
    </div>
  );
}

// ─── Project Editor ────────────────────

function ProjectEditor({ project, onSave, onCancel }: {
  project: Project | null; onSave: (p: Project) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>(project || {
    id: '', title: '', description: '', badge: '', tags: [],
    screenshots: [], githubUrl: '', liveUrl: '', featured: true,
  });
  const [tagInput, setTagInput] = useState(form.tags.join(', '));
  const [screenshotInput, setScreenshotInput] = useState('');

  const update = (key: keyof Project, value: unknown) => setForm({ ...form, [key]: value });

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        update('screenshots', [...form.screenshots, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const addScreenshotPath = () => {
    if (screenshotInput.trim()) {
      update('screenshots', [...form.screenshots, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const removeScreenshot = (i: number) => {
    update('screenshots', form.screenshots.filter((_, idx) => idx !== i));
  };

  const save = () => {
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const id = form.id || generateId(form.title);
    onSave({ ...form, id, tags });
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', marginBottom: '2rem' }}>
      <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>
        {project ? 'Edit Project' : 'New Project'}
      </h3>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={form.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Badge</label>
          <input style={inputStyle} value={form.badge || ''} onChange={(e) => update('badge', e.target.value)} placeholder="e.g. Open Source, Commercial, Private" />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Tags (comma separated)</label>
          <input style={inputStyle} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Python, aiogram, PostgreSQL" />
        </div>
        <div>
          <label style={labelStyle}>GitHub URL</label>
          <input style={inputStyle} value={form.githubUrl || ''} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." />
        </div>
        <div>
          <label style={labelStyle}>Live URL / Bot</label>
          <input style={inputStyle} value={form.liveUrl || ''} onChange={(e) => update('liveUrl', e.target.value)} placeholder="https://t.me/..." />
        </div>

        {/* Screenshots */}
        <div>
          <label style={labelStyle}>Screenshots</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {form.screenshots.map((src, i) => (
              <div key={i} style={{ width: '120px', height: '75px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removeScreenshot(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', color: '#e84040', border: 'none', cursor: 'pointer', fontSize: '14px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={screenshotInput} onChange={(e) => setScreenshotInput(e.target.value)} placeholder="File path or URL" />
            <button onClick={addScreenshotPath} style={btnOutline}>Add Path</button>
          </div>
          <label style={{ ...btnOutline, display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>
            Upload File
            <input type="file" accept="image/*" onChange={handleScreenshotUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Featured */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} style={{ accentColor: '#fff' }} />
          <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Show on homepage (featured)</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={save} style={btnStyle}>Save</button>
        <button onClick={onCancel} style={btnOutline}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Tech Editor ───────────────────────

function TechEditor({ categories, onSave }: { categories: TechCategory[]; onSave: (c: TechCategory[]) => void }) {
  const [cats, setCats] = useState(categories);
  const [newCat, setNewCat] = useState('');
  const [newItems, setNewItems] = useState<Record<number, string>>({});

  const addCategory = () => {
    if (newCat.trim()) {
      setCats([...cats, { label: newCat.trim(), items: [] }]);
      setNewCat('');
    }
  };

  const removeCategory = (i: number) => setCats(cats.filter((_, idx) => idx !== i));

  const addItem = (catIdx: number) => {
    const val = newItems[catIdx]?.trim();
    if (val) {
      const updated = [...cats];
      updated[catIdx] = { ...updated[catIdx], items: [...updated[catIdx].items, val] };
      setCats(updated);
      setNewItems({ ...newItems, [catIdx]: '' });
    }
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const updated = [...cats];
    updated[catIdx] = { ...updated[catIdx], items: updated[catIdx].items.filter((_, i) => i !== itemIdx) };
    setCats(updated);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {cats.map((cat, ci) => (
          <div key={ci} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{cat.label}</h4>
              <button onClick={() => removeCategory(ci)} style={{ ...btnDanger, padding: '4px 10px', fontSize: '10px' }}>Delete</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '0.75rem' }}>
              {cat.items.map((item, ii) => (
                <li key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                  {item}
                  <button onClick={() => removeItem(ci, ii)} style={{ background: 'none', border: 'none', color: 'rgba(232,64,64,0.5)', cursor: 'pointer', fontSize: '14px' }}>×</button>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: '12px' }}
                value={newItems[ci] || ''} onChange={(e) => setNewItems({ ...newItems, [ci]: e.target.value })}
                placeholder="New item"
                onKeyDown={(e) => e.key === 'Enter' && addItem(ci)} />
              <button onClick={() => addItem(ci)} style={{ ...btnOutline, padding: '6px 12px', fontSize: '10px' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input style={{ ...inputStyle, maxWidth: '240px' }} value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category name" onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
        <button onClick={addCategory} style={btnOutline}>Add Category</button>
      </div>

      <button onClick={() => onSave(cats)} style={btnStyle}>Save Tech Stack</button>
    </div>
  );
}

// ─── Main Admin Page ───────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAdminAuthed());
  const [tab, setTab] = useState<'projects' | 'tech'>('projects');
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [techStack, setTechStack] = useState<TechCategory[]>(getTechStack());
  const [editing, setEditing] = useState<Project | null | 'new'>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!authed) {
    return <Layout><LoginGate onAuth={() => setAuthed(true)} /></Layout>;
  }

  const handleSaveProject = (p: Project) => {
    let updated: Project[];
    const existing = projects.find(x => x.id === p.id);
    if (existing) {
      updated = projects.map(x => x.id === p.id ? p : x);
    } else {
      updated = [...projects, p];
    }
    setProjects(updated);
    saveProjects(updated);
    setEditing(null);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
  };

  const handleSaveTech = (cats: TechCategory[]) => {
    setTechStack(cats);
    saveTechStack(cats);
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 24px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
    fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.3s',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
  });

  return (
    <Layout>
      <section style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '4rem' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              Admin Panel
            </h1>
            <Link to="/" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              ← Back to site
            </Link>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setTab('projects')} style={tabStyle(tab === 'projects')}>Projects</button>
            <button onClick={() => setTab('tech')} style={tabStyle(tab === 'tech')}>Tech Stack</button>
          </div>

          {/* Projects Tab */}
          {tab === 'projects' && (
            <div>
              {editing !== null ? (
                <ProjectEditor
                  project={editing === 'new' ? null : editing}
                  onSave={handleSaveProject}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <>
                  <button onClick={() => setEditing('new')} style={{ ...btnStyle, marginBottom: '2rem' }}>
                    + New Project
                  </button>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {projects.map((p) => (
                      <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{p.title}</h3>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                            {p.badge && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px' }}>{p.badge}</span>}
                            <span style={{ fontSize: '10px', color: p.featured ? 'rgba(42,138,42,0.8)' : 'rgba(255,255,255,0.15)' }}>
                              {p.featured ? '★ Featured' : 'Hidden'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>
                              {p.screenshots.length} screenshots
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setEditing(p)} style={{ ...btnOutline, padding: '6px 16px', fontSize: '10px' }}>Edit</button>
                          <button onClick={() => handleDeleteProject(p.id)} style={{ ...btnDanger, padding: '6px 16px', fontSize: '10px' }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tech Tab */}
          {tab === 'tech' && (
            <TechEditor categories={techStack} onSave={handleSaveTech} />
          )}
        </div>
      </section>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  type Project, type TechCategory,
  checkAdminAuth, isAdminAuthed, setAdminAuth, generateId, usePortfolio, isMediaVideo
} from '../lib/store';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8e8', fontSize: '14px',
  fontFamily: 'Inter, sans-serif', outline: 'none',
};
const btnStyle: React.CSSProperties = {
  padding: '10px 24px', background: '#fff', color: '#000', fontSize: '12px',
  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
  border: 'none', cursor: 'pointer',
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

// ─── Login ─────────────────────────────

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminAuth(pw)) { setAdminAuth(); onAuth(); } else setError(true);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '360px', padding: '0 2rem' }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', textAlign: 'center' }}>Admin</h1>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Password" autoFocus style={{ ...inputStyle, marginBottom: '1rem', borderColor: error ? 'rgba(232,64,64,0.5)' : undefined }} />
        {error && <p style={{ fontSize: '12px', color: '#e84040', marginBottom: '1rem' }}>Wrong password</p>}
        <button type="submit" style={{ ...btnStyle, width: '100%' }}>Enter</button>
      </form>
    </div>
  );
}

// ─── Project Editor ────────────────────

const compressImage = (file: File, maxWidth = 1600): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function ProjectEditor({ project, onSave, onCancel, isSaving }: {
  project: Project | null; onSave: (p: Project) => void; onCancel: () => void; isSaving?: boolean;
}) {
  const empty: Project = {
    id: '', title: '', title_ru: '', description: '', description_ru: '',
    badge: '', tags: [], cover: '', screenshots: [], githubUrl: '', liveUrl: '', featured: true,
  };
  const [form, setForm] = useState<Project>(project || empty);
  const [tagInput, setTagInput] = useState(form.tags.join(', '));
  const [screenshotInput, setScreenshotInput] = useState('');
  const [coverInput, setCoverInput] = useState('');

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      update('cover', compressed);
    } catch (err) {
      console.error("Failed to compress cover", err);
    }
  };

  const addCoverPath = () => {
    if (coverInput.trim()) { update('cover', coverInput.trim()); setCoverInput(''); }
  };

  const update = (key: keyof Project, value: unknown) => setForm({ ...form, [key]: value });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    try {
      const newScreenshots = [...form.screenshots];
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file);
        newScreenshots.push(compressed);
      }
      update('screenshots', newScreenshots);
    } catch (err) {
      console.error("Failed to compress screenshots", err);
    }
  };

  const addPath = () => {
    if (screenshotInput.trim()) {
      update('screenshots', [...form.screenshots, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const removeSS = (i: number) => update('screenshots', form.screenshots.filter((_, idx) => idx !== i));

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
        {/* EN Title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Title (EN)</label>
            <input style={inputStyle} value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Title (RU)</label>
            <input style={inputStyle} value={form.title_ru} onChange={(e) => update('title_ru', e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Badge</label>
          <input style={inputStyle} value={form.badge || ''} onChange={(e) => update('badge', e.target.value)} placeholder="Open Source, Commercial, Private" />
        </div>

        {/* Cover */}
        <div>
          <label style={labelStyle}>Cover / Обложка</label>
          {form.cover && (
            <div style={{ width: '200px', height: '125px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '0.75rem' }}>
              {isMediaVideo(form.cover) ? (
                <video src={form.cover} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={form.cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <button onClick={() => update('cover', '')} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', color: '#e84040', border: 'none', cursor: 'pointer', fontSize: '14px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={coverInput} onChange={(e) => setCoverInput(e.target.value)} placeholder="URL or file path" />
            <button onClick={addCoverPath} style={btnOutline}>Set</button>
          </div>
          <label style={{ ...btnOutline, display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>
            Upload Cover <input type="file" accept="image/*,video/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* EN Description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Description (EN)</label>
            <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Description (RU)</label>
            <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} value={form.description_ru} onChange={(e) => update('description_ru', e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Tags (comma separated)</label>
          <input style={inputStyle} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Python, aiogram, PostgreSQL" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input style={inputStyle} value={form.githubUrl || ''} onChange={(e) => update('githubUrl', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Live URL / Bot</label>
            <input style={inputStyle} value={form.liveUrl || ''} onChange={(e) => update('liveUrl', e.target.value)} />
          </div>
        </div>

        {/* Screenshots */}
        <div>
          <label style={labelStyle}>Screenshots / Videos</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {form.screenshots.map((src, i) => (
              <div key={i} style={{ width: '120px', height: '75px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {isMediaVideo(src) ? (
                  <video src={src} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <button onClick={() => removeSS(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', color: '#e84040', border: 'none', cursor: 'pointer', fontSize: '14px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={screenshotInput} onChange={(e) => setScreenshotInput(e.target.value)} placeholder="File path or URL" />
            <button onClick={addPath} style={btnOutline}>Add</button>
          </div>
          <label style={{ ...btnOutline, display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>
            Upload <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} style={{ accentColor: '#fff' }} />
          <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Featured (show on homepage)</label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={save} style={{ ...btnStyle, opacity: isSaving ? 0.7 : 1 }} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} style={btnOutline} disabled={isSaving}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Tech Editor ───────────────────────

function TechEditor({ categories, onSave }: { categories: TechCategory[]; onSave: (c: TechCategory[]) => void }) {
  const [cats, setCats] = useState(categories);
  const [newCat, setNewCat] = useState('');
  const [newItems, setNewItems] = useState<Record<number, string>>({});

  const addCat = () => { if (newCat.trim()) { setCats([...cats, { label: newCat.trim(), items: [] }]); setNewCat(''); } };
  const removeCat = (i: number) => setCats(cats.filter((_, idx) => idx !== i));
  const addItem = (ci: number) => {
    const val = newItems[ci]?.trim();
    if (val) { const u = [...cats]; u[ci] = { ...u[ci], items: [...u[ci].items, val] }; setCats(u); setNewItems({ ...newItems, [ci]: '' }); }
  };
  const removeItem = (ci: number, ii: number) => {
    const u = [...cats]; u[ci] = { ...u[ci], items: u[ci].items.filter((_, i) => i !== ii) }; setCats(u);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {cats.map((cat, ci) => (
          <div key={ci} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{cat.label}</h4>
              <button onClick={() => removeCat(ci)} style={{ ...btnDanger, padding: '4px 10px', fontSize: '10px' }}>Del</button>
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
                placeholder="New item" onKeyDown={(e) => e.key === 'Enter' && addItem(ci)} />
              <button onClick={() => addItem(ci)} style={{ ...btnOutline, padding: '6px 12px', fontSize: '10px' }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input style={{ ...inputStyle, maxWidth: '240px' }} value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" onKeyDown={(e) => e.key === 'Enter' && addCat()} />
        <button onClick={addCat} style={btnOutline}>Add Category</button>
      </div>
      <button onClick={() => onSave(cats)} style={btnStyle}>Save Tech Stack</button>
    </div>
  );
}

// ─── Main ──────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAdminAuthed());
  const [tab, setTab] = useState<'projects' | 'tech'>('projects');
  const { projects, techStack, saveProjects, saveTechStack, uploadImage } = usePortfolio();
  const [editing, setEditing] = useState<Project | null | 'new'>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!authed) return <Layout><LoginGate onAuth={() => setAuthed(true)} /></Layout>;

  const handleSave = async (p: Project) => {
    setIsSaving(true);
    try {
      if (p.cover && p.cover.startsWith('data:image')) {
        p.cover = await uploadImage(p.cover, `projects/${p.id}/cover`);
      }
      
      const uploadedScreenshots = await Promise.all(p.screenshots.map(async (src, i) => {
        if (src.startsWith('data:image')) return await uploadImage(src, `projects/${p.id}/screenshot_${i}`);
        return src;
      }));
      p.screenshots = uploadedScreenshots;

      const existing = projects.find(x => x.id === p.id);
      const updated = existing ? projects.map(x => x.id === p.id ? p : x) : [...projects, p];
      await saveProjects(updated);
      setEditing(null);
    } catch (err: any) {
      console.error("Failed to save project", err);
      if (err.message && err.message.includes("timeout")) {
        alert("Ошибка: Превышено время ожидания. Вы точно активировали Firebase Storage (и Firestore) в консоли Firebase? Зайдите в Build -> Storage и нажмите Get Started.");
      } else {
        alert("Error saving project. See console.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const updated = projects.filter(p => p.id !== id);
    await saveProjects(updated);
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '10px 24px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
    fontWeight: 500, cursor: 'pointer', border: 'none',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
  });

  return (
    <Layout>
      <section style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '4rem' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Admin Panel</h1>
            <Link to="/" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back</Link>
          </div>

          <div style={{ display: 'flex', gap: '2px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setTab('projects')} style={tabBtn(tab === 'projects')}>Projects</button>
            <button onClick={() => setTab('tech')} style={tabBtn(tab === 'tech')}>Tech Stack</button>
          </div>

          {tab === 'projects' && (
            editing !== null ? (
              <ProjectEditor project={editing === 'new' ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} isSaving={isSaving} />
            ) : (
              <>
                <button onClick={() => setEditing('new')} style={{ ...btnStyle, marginBottom: '2rem' }}>+ New Project</button>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {projects.map((p) => (
                    <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                          {p.title} <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>/ {p.title_ru}</span>
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                          {p.badge && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px' }}>{p.badge}</span>}
                          <span style={{ fontSize: '10px', color: p.featured ? 'rgba(42,138,42,0.8)' : 'rgba(255,255,255,0.15)' }}>
                            {p.featured ? '★ Featured' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setEditing(p)} style={{ ...btnOutline, padding: '6px 16px', fontSize: '10px' }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ ...btnDanger, padding: '6px 16px', fontSize: '10px' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}

          {tab === 'tech' && (
            <TechEditor categories={techStack} onSave={(c) => { saveTechStack(c); alert("Tech Stack Saved!"); }} />
          )}
        </div>
      </section>
    </Layout>
  );
}

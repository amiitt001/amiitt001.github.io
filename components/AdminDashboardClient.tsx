'use client';

import { useState } from 'react';
import { 
  updateProjectAction, createProjectAction, deleteProjectAction, syncGitHubReposAction 
} from '@/lib/actions';
import { RefreshCw, UploadCloud, CheckCircle, Info, Lock, Trash2, Edit2 } from 'lucide-react';

const PASSCODE = 'admin123';

export default function AdminDashboardClient({ initialProjects, initialMessages }: { initialProjects: any[]; initialMessages: any[] }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [projects, setProjects] = useState(initialProjects);
  const [messages] = useState(initialMessages);

  const [tab, setTab] = useState<'pending' | 'approved' | 'messages' | 'settings'>('pending');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [pat, setPat] = useState('');

  // Editing state
  const [editProject, setEditProject] = useState<any | null>(null);

  const pendingProjects = projects.filter(p => !p.approved);
  const approvedProjects = projects.filter(p => p.approved);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === PASSCODE) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSyncGitHub = async () => {
    setSyncStatus('Fetching public repositories for @amiitt001...');
    const result = await syncGitHubReposAction('amiitt001');
    if (result.success) {
      setSyncStatus(`Sync complete! Found ${result.count} newly discovered repository(ies).`);
      window.location.reload();
    } else {
      setSyncStatus(`Sync failed: ${result.error}`);
    }
  };

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    await updateProjectAction(id, { approved: !currentApproved });
    setProjects(prev => prev.map(p => p.id === id ? { ...p, approved: !currentApproved } : p));
    setSyncStatus(`Project status updated.`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProjectAction(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setSyncStatus('Project deleted.');
  };

  const handleSaveProjectModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProject) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      icon: formData.get('icon') as string,
      iconBg: formData.get('iconBg') as string,
      githubUrl: formData.get('githubUrl') as string,
      demoUrl: formData.get('demoUrl') as string,
      problem: formData.get('problem') as string,
      architecture: formData.get('architecture') as string,
      approved: true,
    };

    if (editProject.id) {
      await updateProjectAction(editProject.id, data);
    } else {
      await createProjectAction({ name: data.title, ...data, featured: true } as any);
    }

    setEditProject(null);
    window.location.reload();
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bcard p-8 w-full max-w-md bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="sticker" style={{ background: 'var(--yellow)' }}><Lock className="h-5 w-5" /></div>
            <span className="mono text-xs font-bold text-gray-500">// SECURE ACCESS</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-sm text-gray-600 mb-6">Enter your security PIN to access Next.js portfolio project management and server actions.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mono uppercase mb-2">Security Passcode</label>
              <input 
                type="password" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                required 
                placeholder="••••••••" 
                className="w-full border-2 border-black rounded p-3 font-mono text-lg focus:bg-yellow-50 focus:outline-none" 
              />
            </div>
            {authError && <p className="text-xs font-bold text-red-600">Incorrect passcode. Try `admin123`.</p>}
            <button type="submit" className="w-full btn btn-black">
              Unlock Dashboard 🔓
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center mono">Passcode: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-black font-bold">admin123</code></p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 flex-grow w-full">
      {/* Top Banner */}
      {syncStatus && (
        <div className="mb-6 bcard p-4 bg-blue-50 border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold">{syncStatus}</span>
          </div>
          <button onClick={() => setSyncStatus(null)} className="text-xs font-bold text-gray-500 hover:text-black">Dismiss ✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bcard p-5 bg-white">
          <div className="text-xs font-bold mono text-gray-500 uppercase">Live Portfolio Projects</div>
          <div className="text-3xl font-bold mono mt-1">{approvedProjects.length}</div>
        </div>
        <div className="bcard p-5" style={{ background: '#ffd6e7' }}>
          <div className="text-xs font-bold mono text-gray-700 uppercase">Pending Approval Queue</div>
          <div className="text-3xl font-bold mono mt-1">{pendingProjects.length}</div>
        </div>
        <div className="bcard p-5" style={{ background: '#ccf5e7' }}>
          <div className="text-xs font-bold mono text-gray-700 uppercase">Contact Messages</div>
          <div className="text-3xl font-bold mono mt-1">{messages.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-black pb-4">
        <button onClick={() => setTab('pending')} className={`filter-btn ${tab === 'pending' ? 'active' : ''}`}>
          📥 Pending Queue ({pendingProjects.length})
        </button>
        <button onClick={() => setTab('approved')} className={`filter-btn ${tab === 'approved' ? 'active' : ''}`}>
          ✅ Approved Projects ({approvedProjects.length})
        </button>
        <button onClick={() => setTab('messages')} className={`filter-btn ${tab === 'messages' ? 'active' : ''}`}>
          💬 Messages ({messages.length})
        </button>
        <button onClick={() => handleSyncGitHub()} className="btn btn-yellow text-xs ml-auto">
          <RefreshCw className="h-4 w-4" /> Sync GitHub Repos
        </button>
      </div>

      {/* Tab: Pending Queue */}
      {tab === 'pending' && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold">Discovered Repositories (Awaiting Review)</h3>
          {pendingProjects.length === 0 ? (
            <div className="bcard p-8 text-center text-gray-500 bg-white">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-semibold text-gray-700">No pending repositories awaiting approval.</p>
              <p className="text-xs text-gray-500 mt-1">Click "Sync GitHub Repos" to pull newly published repos from @amiitt001.</p>
            </div>
          ) : (
            pendingProjects.map((p) => (
              <div key={p.id} className="bcard p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="sticker" style={{ background: p.iconBg }}>{p.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg">{p.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    <a href={p.githubUrl} target="_blank" className="tag tag-yellow mt-2 inline-block">GitHub ↗</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditProject(p)} className="btn btn-yellow text-xs py-2 px-3">
                    <CheckCircle className="h-4 w-4" /> Review & Approve
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-outline text-xs py-2 px-3 text-red-600 border-red-600">
                    Ignore
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab: Approved Projects */}
      {tab === 'approved' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Live Portfolio Projects</h3>
            <button onClick={() => setEditProject({ title: '', description: '', category: 'ai', icon: '🤖', iconBg: '#ccf5e7', githubUrl: '', demoUrl: '' })} className="btn btn-yellow text-xs py-1.5 px-3">
              + Add Custom Project
            </button>
          </div>
          {approvedProjects.map((p) => (
            <div key={p.id} className="bcard p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="sticker" style={{ background: p.iconBg }}>{p.icon}</div>
                <div>
                  <h4 className="font-bold text-lg">{p.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 max-w-xl">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="tag tag-green">Live</span>
                    <a href={p.githubUrl} target="_blank" className="tag tag-yellow">GitHub ↗</a>
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" className="tag tag-blue">Demo ↗</a>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setEditProject(p)} className="btn btn-outline text-xs py-2 px-3">
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <button onClick={() => handleToggleApprove(p.id, p.approved)} className="btn btn-black text-xs py-2 px-3">
                  Unpublish
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-outline text-xs p-2 text-red-600 border-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Tab: Messages */}
      {tab === 'messages' && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold">Contact Inbox Submissions</h3>
          {messages.length === 0 ? (
            <div className="bcard p-8 text-center text-gray-500 bg-white">No contact messages received yet.</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="bcard p-5 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-base">{m.name} ({m.email})</h4>
                  <span className="text-xs text-gray-400 mono">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border border-black">{m.message}</p>
              </div>
            ))
          )}
        </section>
      )}

      {/* Project Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bcard p-6 w-full max-w-xl bg-white">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h3 className="font-bold text-xl">{editProject.id ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setEditProject(null)} className="font-bold text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveProjectModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1">Display Title</label>
                <input name="title" defaultValue={editProject.title} required className="w-full border-2 border-black rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1">Description</label>
                <textarea name="description" defaultValue={editProject.description} required rows={3} className="w-full border-2 border-black rounded p-2 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Category</label>
                  <select name="category" defaultValue={editProject.category || 'ai'} className="w-full border-2 border-black rounded p-2 text-sm">
                    <option value="ai">AI & Agents 🧠</option>
                    <option value="vision">Vision & ML 👁️</option>
                    <option value="tools">Web & Tools ⚡</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Emoji Icon</label>
                  <input name="icon" defaultValue={editProject.icon || '🤖'} className="w-full border-2 border-black rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Icon Bg Color</label>
                  <input name="iconBg" defaultValue={editProject.iconBg || '#ccf5e7'} className="w-full border-2 border-black rounded p-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">GitHub URL</label>
                  <input name="githubUrl" defaultValue={editProject.githubUrl} required className="w-full border-2 border-black rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Demo URL</label>
                  <input name="demoUrl" defaultValue={editProject.demoUrl || ''} className="w-full border-2 border-black rounded p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1">Architecture Flow Pipeline (Optional)</label>
                <input name="architecture" defaultValue={editProject.architecture || ''} placeholder="Input → Engine → Output" className="w-full border-2 border-black rounded p-2 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t-2 border-black">
                <button type="button" onClick={() => setEditProject(null)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-yellow text-xs">Save & Publish 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

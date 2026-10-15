'use client';

import { useState } from 'react';
import { 
  updateProjectAction, createProjectAction, deleteProjectAction, syncGitHubReposAction 
} from '@/lib/actions';
import { 
  RefreshCw, CheckCircle, Info, Lock, Trash2, Edit2, Plus, Inbox, ShieldCheck, Mail
} from 'lucide-react';

const PASSCODE = 'admin123';

interface AdminProject {
  id: string;
  name: string;
  title: string;
  description: string;
  problem?: string | null;
  architecture?: string | null;
  keyFeatures?: string | null;
  technicalDecisions?: string | null;
  githubUrl: string;
  demoUrl?: string | null;
  icon: string;
  iconBg: string;
  category: string;
  approved: boolean;
  featured: boolean;
}

interface AdminMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}

export default function AdminDashboardClient({ initialProjects, initialMessages }: { initialProjects: AdminProject[]; initialMessages: AdminMessage[] }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [projects, setProjects] = useState(initialProjects);
  const [messages] = useState(initialMessages);

  const [tab, setTab] = useState<'pending' | 'approved' | 'messages'>('approved');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Editing state
  const [editProject, setEditProject] = useState<Partial<AdminProject> | null>(null);

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
      setSyncStatus(`Sync complete! Discovered ${result.count} repository(ies).`);
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
      await createProjectAction({ name: data.title, ...data, featured: true });
    }

    setEditProject(null);
    window.location.reload();
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bcard-primary p-8 w-full max-w-md bg-white">
          <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-3">
            <div className="sticker" style={{ background: 'var(--yellow)' }}>
              <Lock className="h-5 w-5 text-black" />
            </div>
            <span className="mono text-xs font-bold text-gray-500 uppercase">{"// Admin Auth"}</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Admin Dashboard</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Enter your passcode to manage portfolio projects, discovery queue, and contact messages.
          </p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mono uppercase mb-2 text-black">Security Passcode</label>
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
            <button type="submit" className="w-full btn btn-black py-3">
              Unlock Dashboard 🔓
            </button>
          </form>
          <div className="mt-5 text-center text-xs font-mono text-gray-500">
            Passcode hint: <code className="bg-yellow-200 px-1.5 py-0.5 rounded text-black font-bold border border-black">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 flex-grow w-full">
      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="mb-6 bcard p-4 bg-yellow-100 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-black" />
            <span className="text-sm font-bold text-black">{syncStatus}</span>
          </div>
          <button onClick={() => setSyncStatus(null)} className="text-xs font-bold text-black hover:underline">Dismiss ✕</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bcard-primary p-5 bg-white">
          <div className="text-xs font-bold mono text-gray-500 uppercase">Live Portfolio Projects</div>
          <div className="text-3xl font-bold mono mt-1 text-black">{approvedProjects.length}</div>
        </div>
        <div className="bcard p-5" style={{ background: '#ffd6e7' }}>
          <div className="text-xs font-bold mono text-gray-800 uppercase">Pending Review Queue</div>
          <div className="text-3xl font-bold mono mt-1 text-black">{pendingProjects.length}</div>
        </div>
        <div className="bcard p-5" style={{ background: '#ccf5e7' }}>
          <div className="text-xs font-bold mono text-gray-800 uppercase">Contact Messages</div>
          <div className="text-3xl font-bold mono mt-1 text-black">{messages.length}</div>
        </div>
      </div>

      {/* Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b-2 border-black pb-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTab('approved')} className={`filter-btn ${tab === 'approved' ? 'active' : ''}`}>
            <ShieldCheck className="h-3.5 w-3.5 inline mr-1" /> Approved ({approvedProjects.length})
          </button>
          <button onClick={() => setTab('pending')} className={`filter-btn ${tab === 'pending' ? 'active' : ''}`}>
            <Inbox className="h-3.5 w-3.5 inline mr-1" /> Pending Queue ({pendingProjects.length})
          </button>
          <button onClick={() => setTab('messages')} className={`filter-btn ${tab === 'messages' ? 'active' : ''}`}>
            <Mail className="h-3.5 w-3.5 inline mr-1" /> Inbox ({messages.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSyncGitHub} className="btn btn-yellow text-xs py-2 px-3">
            <RefreshCw className="h-3.5 w-3.5" /> Sync GitHub
          </button>
          <button onClick={() => setEditProject({ title: '', description: '', category: 'ai', icon: '🤖', iconBg: '#ccf5e7', githubUrl: '', demoUrl: '' })} className="btn btn-black text-xs py-2 px-3">
            <Plus className="h-3.5 w-3.5" /> New Project
          </button>
        </div>
      </div>

      {/* Tab: Approved Projects */}
      {tab === 'approved' && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-black mb-4">Live Portfolio Projects</h3>
          {approvedProjects.length === 0 ? (
            <div className="bcard p-8 text-center text-gray-500 bg-white">No active projects found.</div>
          ) : (
            approvedProjects.map((p) => (
              <div key={p.id} className="bcard-primary p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="sticker" style={{ background: p.iconBg }}>{p.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg text-black">{p.title}</h4>
                    <p className="text-sm text-gray-700 mt-1 max-w-xl">{p.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="tag tag-green">Published</span>
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="tag tag-yellow">GitHub ↗</a>
                      {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="tag tag-blue">Demo ↗</a>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setEditProject(p)} className="btn btn-outline text-xs py-2 px-3">
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleToggleApprove(p.id, p.approved)} className="btn btn-black text-xs py-2 px-3">
                    Unpublish
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-outline text-xs p-2 text-red-600 border-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab: Pending Queue */}
      {tab === 'pending' && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-black mb-4">Discovered Repositories (Awaiting Review)</h3>
          {pendingProjects.length === 0 ? (
            <div className="bcard p-8 text-center text-gray-500 bg-white">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-bold text-black">No pending repositories awaiting approval.</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">Click &quot;Sync GitHub&quot; to pull newly created public repositories from @amiitt001.</p>
            </div>
          ) : (
            pendingProjects.map((p) => (
              <div key={p.id} className="bcard p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="sticker" style={{ background: p.iconBg }}>{p.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg text-black">{p.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="tag tag-yellow mt-2 inline-block">GitHub Repository ↗</a>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setEditProject(p)} className="btn btn-yellow text-xs py-2 px-3">
                    <CheckCircle className="h-3.5 w-3.5" /> Review &amp; Publish
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-outline text-xs py-2 px-3 text-red-600 border-red-600">
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab: Messages */}
      {tab === 'messages' && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-black mb-4">Contact Form Submissions</h3>
          {messages.length === 0 ? (
            <div className="bcard p-8 text-center text-gray-500 bg-white">No contact messages received yet.</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="bcard p-5 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-base text-black">{m.name}</h4>
                    <a href={`mailto:${m.email}`} className="text-xs font-mono text-blue-600 hover:underline">{m.email}</a>
                  </div>
                  <span className="text-xs text-gray-500 mono">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded border-2 border-black mt-2 font-mono">{m.message}</p>
              </div>
            ))
          )}
        </section>
      )}

      {/* Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bcard-primary p-6 w-full max-w-xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h3 className="font-bold text-xl text-black">{editProject.id ? 'Edit Project' : 'Add Custom Project'}</h3>
              <button onClick={() => setEditProject(null)} className="font-bold text-lg hover:text-red-600">✕</button>
            </div>
            <form onSubmit={handleSaveProjectModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1 text-black">Display Title</label>
                <input name="title" defaultValue={editProject.title} required className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none focus:bg-yellow-50" />
              </div>
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1 text-black">Description</label>
                <textarea name="description" defaultValue={editProject.description} required rows={3} className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none focus:bg-yellow-50" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1 text-black">Category</label>
                  <select name="category" defaultValue={editProject.category || 'ai'} className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none">
                    <option value="ai">AI &amp; Agents</option>
                    <option value="vision">Vision &amp; ML</option>
                    <option value="tools">Web &amp; Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1 text-black">Icon</label>
                  <input name="icon" defaultValue={editProject.icon || '🤖'} className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1 text-black">Icon Bg Color</label>
                  <input name="iconBg" defaultValue={editProject.iconBg || '#ccf5e7'} className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1 text-black">GitHub URL</label>
                  <input name="githubUrl" defaultValue={editProject.githubUrl} required className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1 text-black">Demo URL</label>
                  <input name="demoUrl" defaultValue={editProject.demoUrl || ''} className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mono uppercase mb-1 text-black">Architecture Flow Pipeline</label>
                <input name="architecture" defaultValue={editProject.architecture || ''} placeholder="Next.js → FastAPI → Gemini → Postgres" className="w-full border-2 border-black rounded p-2 text-sm focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t-2 border-black">
                <button type="button" onClick={() => setEditProject(null)} className="btn btn-outline text-xs py-2">Cancel</button>
                <button type="submit" className="btn btn-yellow text-xs py-2">Save &amp; Publish 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

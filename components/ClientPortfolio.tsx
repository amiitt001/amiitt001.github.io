'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { submitContactMessageAction } from '@/lib/actions';
import { 
  FileText, Copy, ExternalLink, Cpu, Mail, CheckCircle,
  Brain, Code2, Cpu as CpuIcon,
  Trophy, GraduationCap, ArrowUpRight, AlertCircle, Wrench, Sparkles
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface Project {
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

const PROJECT_META: Record<string, { subtitle: string; tech: string[]; metrics?: string[]; bgGradient: string }> = {
  "Deadline Guardian AI": {
    subtitle: "AI Productivity / Agent System",
    tech: ["Next.js", "FastAPI", "Gemini", "PostgreSQL", "GCP"],
    metrics: ["270+ tests", "4 AI engines", "Cloud Run", "Gemini Agent"],
    bgGradient: "linear-gradient(135deg, #1e1e24 0%, #2b1055 100%)",
  },
  "SkillSphere": {
    subtitle: "AI Career Intelligence Platform",
    tech: ["Gemini 1.5", "Vertex AI", "FastAPI", "Next.js", "Qdrant"],
    metrics: ["RAG Engine", "ATS Matcher", "Vector Search"],
    bgGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  "Dogs-Vs-Cat-detection": {
    subtitle: "Real-Time Computer Vision Pipeline",
    tech: ["YOLOv8", "PyTorch", "MobileNetV2", "OpenCV", "Python"],
    metrics: ["98.4% Accuracy", "18ms Latency", "Edge Classification"],
    bgGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  "adk-hiring-agent": {
    subtitle: "Multi-Agent Hiring Evaluation System",
    tech: ["Google ADK", "Gemini 1.5", "Python", "FastAPI", "n8n"],
    metrics: ["5 Sub-agents", "GitHub API", "Rubric Evaluation"],
    bgGradient: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
  },
  "llc": {
    subtitle: "Zero-Server Privacy Tool Suite",
    tech: ["TypeScript", "WebAssembly", "Canvas API", "Next.js"],
    metrics: ["100% Offline", "Zero Server Storage", "Instant WASM"],
    bgGradient: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
  }
};

export default function ClientPortfolio({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState('all');
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const approvedProjects = initialProjects.filter(p => p.approved);
  const filteredProjects = filter === 'all' 
    ? approvedProjects 
    : approvedProjects.filter(p => p.category === filter);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip canvas animation entirely when user prefers reduced motion
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.offsetWidth || 800;
    const height = canvas.height = canvas.parentElement?.offsetHeight || 600;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    const count = Math.min(30, Math.floor(width / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0d0d0d';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(13, 13, 13, ${1 - dist / 100})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(245, 217, 10, ${1 - mdist / 130})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('amiitt.v001@gmail.com');
    showToast('Email copied to clipboard!');
  };

  const toggleDrawer = (id: string) => {
    setOpenDrawers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const message = (formData.get('message') as string || '').trim();

    const errors: { name?: string; email?: string; message?: string } = {};
    if (!name) errors.name = 'Name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!message) errors.message = 'Message cannot be empty';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      await submitContactMessageAction({ name, email, message });
      showToast('Message sent! Amit will get back to you shortly.');
      (e.target as HTMLFormElement).reset();
    } catch {
      showToast('Error sending message. Please try emailing directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow">
      {/* Toast Notification */}
      {toastMsg && (
        <div id="toast" className="show">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 01. Hero Section */}
      <section id="home" className="hero-section" style={{ position: 'relative' }}>
        {/* Animated canvas — hidden by CSS when prefers-reduced-motion is set */}
        {!reducedMotion && <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />}
        {/* Static fallback gradient shown to reduced-motion users */}
        {reducedMotion && <div className="canvas-fallback" aria-hidden="true" />}

        <div className="hero-grid" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <div className="hero-label mono">{"// hello world"}</div>
            <h1 className="hero-h1">
              I build <span className="hl">intelligent software</span> at the intersection of AI, engineering, and automation.
            </h1>
            <p className="hero-sub">
              AI / Software Engineer building production-focused multi-agent systems, RAG pipelines, computer vision applications, and scalable web systems.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-black">View Projects ↓</a>
              <a href="#resume" className="btn btn-yellow">
                <FileText className="h-4 w-4" /> Download Resume
              </a>
              <button onClick={copyEmail} className="btn btn-outline" title="Copy Email Address">
                <Copy className="h-4 w-4" /> Copy Email
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="hero-frame" style={{ width: '100%', maxWidth: '320px' }}>
              <div className="hero-frame-dots">
                <span className="hero-frame-dot" style={{ background: '#ff6b9d' }}></span>
                <span className="hero-frame-dot" style={{ background: '#f5d90a' }}></span>
                <span className="hero-frame-dot" style={{ background: '#00c48c' }}></span>
              </div>
              <Image
                src="https://avatars.githubusercontent.com/u/185125017?s=400"
                alt="Amit Verma Profile"
                width={320}
                height={320}
                className="hero-photo"
                priority
              />
              <div className="hero-tags">
                <span className="tag tag-yellow">AI Systems</span>
                <span className="tag tag-pink">Full Stack</span>
                <span className="tag tag-blue">Cloud Architecture</span>
                <span className="tag tag-green">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <span>Python</span><span className="dot">✦</span>
          <span>Google ADK</span><span className="dot">✦</span>
          <span>Gemini AI</span><span className="dot">✦</span>
          <span>FastAPI</span><span className="dot">✦</span>
          <span>Next.js</span><span className="dot">✦</span>
          <span>PyTorch</span><span className="dot">✦</span>
          <span>YOLOv8</span><span className="dot">✦</span>
          <span>Google Cloud</span><span className="dot">✦</span>
          <span>Docker</span><span className="dot">✦</span>
          <span>PostgreSQL</span><span className="dot">✦</span>
          <span>TypeScript</span><span className="dot">✦</span>
          <span>C++</span><span className="dot">✦</span>
          <span>Python</span><span className="dot">✦</span>
          <span>Google ADK</span><span className="dot">✦</span>
          <span>Gemini AI</span><span className="dot">✦</span>
        </div>
      </div>

      {/* 02. About Section */}
      <section id="about" className="section-wrap">
        <div className="section-label">01 // About Me</div>
        <div className="about-grid">
          <div className="space-y-4 text-base leading-relaxed" style={{ color: '#3f4652' }}>
            <p className="text-xl font-bold text-black leading-snug">
              AI / Software Engineer — turning complex research &amp; algorithms into reliable production systems.
            </p>
            <p>
              I build production-oriented AI systems — from multi-agent workflows and RAG pipelines to real-time computer vision applications and scalable full-stack web products.
            </p>
            <p>
              Currently pursuing Computer Science Engineering at Galgotias College of Engineering and Technology (GCET). My focus lies in clean architecture, low-latency API design, and verifiable AI automation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bcard p-5 flex items-start gap-4">
              <div className="sticker" style={{ background: '#ccf5e7' }}>
                <Brain className="h-5 w-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-base text-black">AI Systems</h4>
                <p className="text-xs text-gray-600 mt-1 font-mono">Gemini • ADK • RAG • Agents</p>
              </div>
            </div>

            <div className="bcard p-5 flex items-start gap-4">
              <div className="sticker" style={{ background: '#ffd6e7' }}>
                <CpuIcon className="h-5 w-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-base text-black">Computer Vision</h4>
                <p className="text-xs text-gray-600 mt-1 font-mono">YOLOv8 • PyTorch • MobileNet</p>
              </div>
            </div>

            <div className="bcard p-5 flex items-start gap-4">
              <div className="sticker" style={{ background: 'var(--yellow)' }}>
                <Code2 className="h-5 w-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-base text-black">Full Stack &amp; Cloud</h4>
                <p className="text-xs text-gray-600 mt-1 font-mono">Next.js • FastAPI • Postgres • GCP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Tech Stack Section */}
      <section id="skills" className="section-wrap" style={{ borderTop: 'var(--border)' }}>
        <div className="section-heading-group">
          <div className="section-label">02 // Tech Stack</div>
          <h2 className="section-title">Core Competencies &amp; Toolkit</h2>
        </div>

        <div className="space-y-6">
          {/* Core Specializations */}
          <div className="bcard-primary p-6" style={{ background: '#fafaf5' }}>
            <div className="flex items-center gap-3 mb-5 border-b border-gray-300 pb-4">
              <div className="sticker" style={{ background: 'var(--yellow)' }}>
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Core Specializations</h3>
                <p className="text-xs font-mono text-gray-600 mt-0.5">Technologies I actively use to architect and deploy production software</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className="skill-pill">Python</span>
              <span className="skill-pill">TypeScript</span>
              <span className="skill-pill">Next.js</span>
              <span className="skill-pill">FastAPI</span>
              <span className="skill-pill">PostgreSQL</span>
              <span className="skill-pill">Docker</span>
              <span className="skill-pill">Google Cloud (GCP)</span>
              <span className="skill-pill">Gemini Models</span>
              <span className="skill-pill">PyTorch</span>
            </div>
          </div>

          {/* Also Worked With */}
          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#d6e8ff' }}>
                <Wrench className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-base text-black">Also Worked With</h3>
                <p className="text-xs font-mono text-gray-500 mt-0.5">Additional frameworks, libraries &amp; developer tooling</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["C++", "Java", "JavaScript", "React", "Tailwind CSS", "HTML5", "CSS3", "Express.js", "Firebase", "Qdrant / Vector DBs", "LangChain", "YOLOv8", "Prisma", "Linux"].map((item, idx) => (
                <span key={idx} className="skill-pill text-xs py-1 px-2.5 font-mono">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04. Featured Projects Showcase */}
      <section id="projects" style={{ borderTop: 'var(--border)', background: '#f5f3ee' }}>
        <div className="section-wrap">
          <div className="projects-header">
            <div>
              <div className="section-label">03 // Deep Engineering Showcase ⭐</div>
              <h2 className="section-title">Production Projects &amp; Systems</h2>
            </div>

            <div className="filter-group">
              <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>All Projects</button>
              <button onClick={() => setFilter('ai')} className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}>AI &amp; Agents</button>
              <button onClick={() => setFilter('vision')} className={`filter-btn ${filter === 'vision' ? 'active' : ''}`}>Vision &amp; ML</button>
              <button onClick={() => setFilter('tools')} className={`filter-btn ${filter === 'tools' ? 'active' : ''}`}>Web &amp; Tools</button>
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((p) => {
              const meta = PROJECT_META[p.name] || {
                subtitle: p.category.toUpperCase() + " Engineering Project",
                tech: ["TypeScript", "Python", "FastAPI"],
                metrics: ["Verified Deployment"],
                bgGradient: "linear-gradient(135deg, #1e1e24 0%, #2c3e50 100%)"
              };

              return (
                <div key={p.id} className="bcard-primary p-6 flex flex-col justify-between" style={{ background: '#ffffff' }}>
                  <div>
                    {/* Mock Product Screenshot Header */}
                    <div className="product-screenshot-frame mb-5">
                      <div className="screenshot-bar">
                        <span className="screenshot-dot" style={{ background: '#ff5f56' }}></span>
                        <span className="screenshot-dot" style={{ background: '#ffbd2e' }}></span>
                        <span className="screenshot-dot" style={{ background: '#27c93f' }}></span>
                        <span className="text-[10px] font-mono text-gray-400 ml-2 overflow-hidden text-ellipsis whitespace-nowrap">{p.githubUrl}</span>
                      </div>
                      <div className="screenshot-content text-white" style={{ background: meta.bgGradient }}>
                        <div className="text-3xl mb-1">{p.icon}</div>
                        <h4 className="font-bold text-lg text-white tracking-tight">{p.name}</h4>
                        <span className="text-xs font-mono text-yellow-300 mt-1">{meta.subtitle}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-black leading-snug">{p.title}</h3>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">{meta.subtitle}</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {p.demoUrl && (
                          <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-yellow px-2.5 py-1 text-xs" title="Live Demo">
                            <ExternalLink className="h-3.5 w-3.5" /> Demo
                          </a>
                        )}
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-2.5 py-1 text-xs" title="GitHub Repository">
                          <GithubIcon className="h-3.5 w-3.5" /> GitHub
                        </a>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{p.description}</p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {meta.tech.map((t, idx) => (
                        <span key={idx} className="tag tag-yellow">{t}</span>
                      ))}
                    </div>

                    {/* Proof Metrics */}
                    {meta.metrics && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                        {meta.metrics.map((m, idx) => (
                          <div key={idx} className="bg-gray-100 border border-black rounded px-2.5 py-1.5 font-mono text-[11px] font-bold text-black flex items-center gap-1.5">
                            <span className="text-green-600 font-bold">✓</span> {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <button onClick={() => toggleDrawer(p.id)} className="btn btn-outline text-xs w-full py-2.5">
                      <Cpu className="h-4 w-4" /> Architecture &amp; Technical Case Study
                    </button>

                    {openDrawers[p.id] && (
                      <div className="project-details-drawer open border-t-2 border-black pt-4 mt-4 space-y-3">
                        {p.problem && <p className="text-xs text-gray-800"><strong>Problem Solved:</strong> {p.problem}</p>}
                        {p.architecture && (
                          <div className="project-architecture-box">
                            <strong>Architecture Pipeline:</strong><br />
                            {p.architecture}
                          </div>
                        )}
                        {p.keyFeatures && (
                          <div className="text-xs text-gray-800">
                            <strong>Key Technical Features:</strong>
                            <p className="mt-1 text-gray-700">{p.keyFeatures}</p>
                          </div>
                        )}
                        {p.technicalDecisions && (
                          <p className="text-xs text-gray-600 italic">
                            <strong>Engineering Rationale:</strong> {p.technicalDecisions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05. Experience Section */}
      <section id="experience" className="section-wrap">
        <div className="section-heading-group">
          <div className="section-label">04 // Experience &amp; Leadership</div>
          <h2 className="section-title">Engineering Involvement &amp; Community Roles</h2>
        </div>

        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="bcard-primary p-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-black">Coordinator</h3>
                  <p className="text-sm font-bold text-gray-800 font-mono">LOOP Tech Club · GCET</p>
                </div>
                <span className="tag tag-yellow">2026 — Present</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Built and maintained the club&apos;s event and membership platform using <strong>Next.js and Firebase</strong>.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-gray-800 border-l-2 border-yellow-400 pl-3">
                <div>→ 400+ student developer community engaged</div>
                <div>→ Organized buildathons, technical speaker sessions &amp; hackathons</div>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="bcard-primary p-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-black">Coordinator</h3>
                  <p className="text-sm font-bold text-gray-800 font-mono">GFG Student Chapter · GCET</p>
                </div>
                <span className="tag tag-pink">2026 — Present</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Organized competitive programming leagues and hands-on cloud development workshops for students.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-gray-800 border-l-2 border-pink-400 pl-3">
                <div>→ Led DSA workshops and problem-solving practice sessions</div>
                <div>→ Facilitated competitive programming contests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. Hackathons & Achievements Section */}
      <section id="achievements" className="section-wrap" style={{ borderTop: 'var(--border)' }}>
        <div className="section-heading-group">
          <div className="section-label">05 // Achievements</div>
          <h2 className="section-title">Hackathons &amp; Credentials</h2>
        </div>

        <div className="achievements-grid">
          <div className="bcard p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">Hackathon</span>
              </div>
              <h4 className="font-bold text-base text-black">Adobe University Hackathon</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">Intelligent Workflow Automation • Built AI Agent pipeline</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-mono text-gray-500">
              <span>National Level</span>
              <span>2026</span>
            </div>
          </div>

          <div className="bcard p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">Hackathon</span>
              </div>
              <h4 className="font-bold text-base text-black">Smart India Hackathon (SIH)</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">Smart Campus System • Architecture Lead</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-mono text-gray-500">
              <span>Government Initiative</span>
              <span>2026</span>
            </div>
          </div>

          <div className="bcard p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">Certification</span>
              </div>
              <h4 className="font-bold text-base text-black">Google Cloud Gen AI Academy</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">Generative AI Models &amp; Vertex AI Training</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-mono text-gray-500">
              <span>Google Cloud</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Problem Solving Section */}
      <section id="problem-solving" className="section-wrap" style={{ borderTop: 'var(--border)' }}>
        <div className="section-heading-group">
          <div className="section-label">06 // Problem Solving</div>
          <h2 className="section-title">Algorithms &amp; Coding Profiles</h2>
        </div>

        <div className="stats-grid">
          <div className="bcard-primary p-6 text-center" style={{ background: 'var(--yellow)' }}>
            <div className="text-4xl font-bold mono text-black">250+</div>
            <div className="text-sm font-bold text-black mt-1">Total Problems Solved</div>
            <div className="text-xs font-mono text-gray-800 mt-2">Combined across platforms in C++ &amp; Python</div>
          </div>

          <div className="bcard p-6 flex flex-col justify-between text-center">
            <div>
              <div className="text-4xl font-bold mono text-orange-600">180+</div>
              <div className="text-sm font-bold text-black mt-1">LeetCode Solved</div>
              <div className="text-xs text-gray-600 mt-1">Arrays, Dynamic Programming, Graphs</div>
            </div>
            <a href="https://leetcode.com/u/amiitt001/" target="_blank" rel="noopener noreferrer" className="btn btn-outline text-xs mt-4 py-2 justify-center">
              View LeetCode Profile <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="bcard p-6 flex flex-col justify-between text-center">
            <div>
              <div className="text-4xl font-bold mono text-blue-600">70+</div>
              <div className="text-sm font-bold text-black mt-1">Codeforces Problems</div>
              <div className="text-xs text-gray-600 mt-1">Contests &amp; Speed Drills</div>
            </div>
            <a href="https://codeforces.com/profile/amiitt001" target="_blank" rel="noopener noreferrer" className="btn btn-outline text-xs mt-4 py-2 justify-center">
              View Codeforces Profile <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 08. Currently Building Section */}
      <section id="building" className="section-wrap">
        <div className="section-label">07 // Currently Building</div>
        <div className="bcard-primary p-6 building-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-black">Deadline Guardian AI (DG-AI)</h3>
              <p className="text-xs mono text-gray-600 mt-0.5">AI-powered deadline risk prediction &amp; recovery engine</p>
            </div>
            <span className="tag tag-yellow">Active Development • 85% Completed</span>
          </div>

          <div className="progress-bar-track mb-6">
            <div className="progress-bar-fill" style={{ width: '85%' }}></div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-bold text-black mb-2">Current Sprint Focus:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-yellow-50 p-2.5 border border-black rounded">✓ Calendar intelligence &amp; event parser</div>
              <div className="bg-yellow-50 p-2.5 border border-black rounded">✓ Gemini risk prediction model</div>
              <div className="bg-yellow-50 p-2.5 border border-black rounded">→ Production Cloud Run deployment</div>
              <div className="bg-yellow-50 p-2.5 border border-black rounded">→ User preference feedback loop</div>
            </div>
          </div>
        </div>
      </section>

      {/* 09. Resume Section */}
      <section id="resume" className="section-wrap" style={{ textAlign: 'center', borderTop: 'var(--border)' }}>
        <div className="section-label">08 // Resume</div>
        <h2 className="text-3xl font-bold text-black mt-2 mb-3">Want the Full Picture?</h2>
        <p style={{ color: "#3f4652", maxWidth: "480px", margin: "0 auto 28px", lineHeight: "1.6" }}>
          Download my resume to see a complete summary of my engineering experience, AI projects, and academic background.
        </p>
        <a href="https://github.com/amiitt001" target="_blank" rel="noopener noreferrer" className="btn btn-black py-3 px-8 text-base">
          <FileText className="h-5 w-5" /> Download Resume (PDF)
        </a>
      </section>

      {/* 10. Contact Section */}
      <section id="contact" style={{ borderTop: 'var(--border)', background: 'rgba(245,217,10,0.08)' }}>
        <div className="section-wrap">
          <div className="mb-8">
            <div className="section-label">09 // Contact</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2 mb-3">LET&apos;S BUILD SOMETHING</h2>
            <p style={{ color: "#3f4652", maxWidth: "560px", lineHeight: "1.6" }}>
              Have an interesting project, internship opportunity, or collaboration in mind? My inbox is open.
            </p>
          </div>

          <div className="contact-grid">
            {/* Left Form with Custom Validation */}
            <div className="bcard-primary p-6" style={{ background: 'var(--white)' }}>
              <h3 className="font-bold text-lg text-black mb-5">Send Me a Message</h3>
              <form onSubmit={handleContactSubmit} noValidate className="contact-form">
                <div>
                  <label className="contact-label">Your Name</label>
                  <input 
                    name="name" 
                    type="text" 
                    placeholder="Jane Doe"
                    className={formErrors.name ? 'error' : ''} 
                  />
                  {formErrors.name && (
                    <div className="contact-error-msg">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="contact-label">Your Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="jane@example.com"
                    className={formErrors.email ? 'error' : ''} 
                  />
                  {formErrors.email && (
                    <div className="contact-error-msg">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="contact-label">Message</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    placeholder="Let's build something awesome..."
                    className={formErrors.message ? 'error' : ''}
                  ></textarea>
                  {formErrors.message && (
                    <div className="contact-error-msg">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.message}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={submitting} className="btn btn-black w-full mt-3 py-3">
                  {submitting ? 'Sending...' : 'Send Message 🚀'}
                </button>
              </form>
            </div>

            {/* Right Direct Reach Out Card */}
            <div className="bcard-primary p-6 flex flex-col justify-between" style={{ background: 'var(--white)' }}>
              <div>
                <h3 className="font-bold text-lg text-black border-b border-gray-200 pb-3 mb-5">Let&apos;s Connect</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold mono text-gray-500 uppercase mb-1">Direct Email</div>
                    <a href="mailto:amiitt.v001@gmail.com" className="text-base font-bold text-black hover:underline break-all">amiitt.v001@gmail.com</a>
                  </div>

                  <div>
                    <div className="text-xs font-bold mono text-gray-500 uppercase mb-1">Location</div>
                    <p className="text-sm font-semibold text-gray-800">Greater Noida / NCR, India</p>
                  </div>

                  <div>
                    <div className="text-xs font-bold mono text-gray-500 uppercase mb-1">Availability</div>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">Open for Remote &amp; On-Site Internships &amp; AI Engineering Roles</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <a href="mailto:amiitt.v001@gmail.com" className="btn btn-black py-2.5">
                  <Mail className="h-4 w-4" /> Email Me Directly
                </a>
                <a href="https://github.com/amiitt001" target="_blank" rel="noopener noreferrer" className="btn btn-yellow py-2.5">
                  <GithubIcon className="h-4 w-4" /> GitHub Profile
                </a>
                <a href="https://www.linkedin.com/in/amiitt001/" target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { submitContactMessageAction } from '@/lib/actions';
import { 
  FileText, Copy, Github, ExternalLink, Cpu, Mail, Linkedin, Twitter, CheckCircle
} from 'lucide-react';

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

export default function ClientPortfolio({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState('all');
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const approvedProjects = initialProjects.filter(p => p.approved);
  const filteredProjects = filter === 'all' 
    ? approvedProjects 
    : approvedProjects.filter(p => p.category === filter);

  // 1. Hero Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.offsetWidth || 800;
    let height = canvas.height = canvas.parentElement?.offsetHeight || 600;

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

    let mouse = { x: -1000, y: -1000 };
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
  }, []);

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
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      await submitContactMessageAction(data);
      showToast('Message sent! Amit will get back to you shortly.');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
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

      <!-- 01. Hero Section -->
      <section id="home" className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <canvas ref={canvasRef} id="hero-canvas"></canvas>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="section-label mono mb-4">// hello world</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              I build <span className="hl">intelligent software</span> at the intersection of AI, engineering, and automation.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-medium mb-8 max-w-lg leading-relaxed">
              Computer Science student building production-focused AI applications, developer tools, and scalable web systems.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn btn-black">View Projects ↓</a>
              <a href="#resume" className="btn btn-yellow">
                <FileText className="h-4 w-4" /> Download Resume
              </a>
              <button onClick={copyEmail} className="btn btn-outline" title="Copy Email Address">
                <Copy className="h-4 w-4" /> Copy Email
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="hero-frame w-72 sm:w-80">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="hero-frame-dot" style={{ background: '#ff6b9d' }}></span>
                <span className="hero-frame-dot" style={{ background: '#f5d90a' }}></span>
                <span className="hero-frame-dot" style={{ background: '#00c48c' }}></span>
              </div>
              <Image
                src="https://avatars.githubusercontent.com/u/185125017?s=400"
                alt="Amit Verma Profile"
                width={320}
                height={320}
                className="w-full rounded-md border-2 border-black object-cover aspect-square"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="tag tag-yellow">AI/ML 🧠</span>
                <span className="tag tag-pink">DevOps ⚙️</span>
                <span className="tag tag-blue">GCP ☁️</span>
                <span className="tag tag-green">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Marquee Ticker -->
      <div className="ticker-wrap">
        <div className="ticker">
          <span>Python</span><span className="dot">✦</span>
          <span>Google ADK</span><span class="dot">✦</span>
          <span>Gemini AI</span><span class="dot">✦</span>
          <span>FastAPI</span><span class="dot">✦</span>
          <span>Next.js</span><span class="dot">✦</span>
          <span>PyTorch</span><span class="dot">✦</span>
          <span>YOLOv8</span><span class="dot">✦</span>
          <span>GCP</span><span class="dot">✦</span>
          <span>Docker</span><span class="dot">✦</span>
          <span>PostgreSQL</span><span class="dot">✦</span>
          <span>TypeScript</span><span class="dot">✦</span>
          <span>C++</span><span class="dot">✦</span>
          <span>Python</span><span class="dot">✦</span>
          <span>Google ADK</span><span class="dot">✦</span>
          <span>Gemini AI</span><span class="dot">✦</span>
        </div>
      </div>

      <!-- 02. About Section -->
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className="section-label">01 // About Me</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <div className="md:col-span-2 space-y-4 text-base leading-relaxed text-gray-700">
            <p className="text-xl font-semibold text-black">
              I'm a Computer Science Engineering student focused on <strong>AI engineering, full-stack development, and automation.</strong>
            </p>
            <p>
              I enjoy turning complex problems into practical software — from AI-powered productivity systems to career intelligence platforms and computer vision applications.
            </p>
            <p>
              Whether orchestrating multi-agent systems with Google ADK or training custom detection models with PyTorch, I prioritize clean architecture, measurable impact, and production reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bcard p-4 flex items-center gap-4">
              <div className="sticker" style={{ background: 'var(--yellow)' }}>🎓</div>
              <div>
                <h4 className="font-bold">CSE Student</h4>
                <p className="text-xs text-gray-500">Galgotias College (GCET)</p>
              </div>
            </div>
            <div className="bcard p-4 flex items-center gap-4" style={{ background: '#ccf5e7' }}>
              <div className="sticker" style={{ background: 'white' }}>🤖</div>
              <div>
                <h4 className="font-bold">AI Engineer</h4>
                <p className="text-xs text-gray-700">Google ADK • Gemini • RAG</p>
              </div>
            </div>
            <div className="bcard p-4 flex items-center gap-4">
              <div className="sticker" style={{ background: '#ffd6e7' }}>💻</div>
              <div>
                <h4 className="font-bold">Full Stack Developer</h4>
                <p className="text-xs text-gray-500">Next.js • FastAPI • GCP • Docker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 03. Tech Stack Section -->
      <section id="skills" className="max-w-6xl mx-auto px-6 py-12 pb-20">
        <div className="section-label">02 // Tech Stack</div>
        <p className="text-sm text-gray-600 mb-6 font-mono">// Grouped technologies I actively defend and deploy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: 'var(--yellow)' }}>💻</div>
              <h3 className="font-bold text-lg">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">C++</span>
              <span className="skill-pill">Python</span>
              <span className="skill-pill">JavaScript</span>
              <span className="skill-pill">TypeScript</span>
              <span className="skill-pill">Java</span>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#d6e8ff' }}>⚛️</div>
              <h3 className="font-bold text-lg">Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">React</span>
              <span className="skill-pill">Next.js</span>
              <span className="skill-pill">Tailwind CSS</span>
              <span className="skill-pill">HTML5</span>
              <span className="skill-pill">CSS3</span>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#ffd6e7' }}>⚙️</div>
              <h3 className="font-bold text-lg">Backend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">FastAPI</span>
              <span className="skill-pill">Node.js</span>
              <span className="skill-pill">Express.js</span>
              <span className="skill-pill">REST APIs</span>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#ccf5e7' }}>🧠</div>
              <h3 className="font-bold text-lg">AI / Machine Learning</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">Gemini</span>
              <span className="skill-pill">LangChain</span>
              <span className="skill-pill">RAG</span>
              <span className="skill-pill">YOLOv8</span>
              <span className="skill-pill">MobileNetV2</span>
              <span className="skill-pill">PyTorch</span>
              <span className="skill-pill">TensorFlow</span>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#ede2ff' }}>🗄️</div>
              <h3 className="font-bold text-lg">Databases</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">PostgreSQL</span>
              <span className="skill-pill">Prisma</span>
              <span className="skill-pill">Firebase</span>
              <span className="skill-pill">Vector DBs</span>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#d6e8ff' }}>☁️</div>
              <h3 className="font-bold text-lg">Cloud & DevOps</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="skill-pill">Google Cloud</span>
              <span className="skill-pill">Cloud Run</span>
              <span className="skill-pill">Docker</span>
              <span className="skill-pill">Git / GitHub</span>
              <span className="skill-pill">Linux</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 04. Featured Projects ⭐ Section -->
      <section id="projects" style={{ borderTop: 'var(--border)' }} className="bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="section-label">03 // Featured Projects ⭐</div>
              <h2 className="text-3xl font-bold mt-1">Deep Engineering Showcase</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>All</button>
              <button onClick={() => setFilter('ai')} className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}>AI & Agents 🧠</button>
              <button onClick={() => setFilter('vision')} className={`filter-btn ${filter === 'vision' ? 'active' : ''}`}>Vision & ML 👁️</button>
              <button onClick={() => setFilter('tools')} className={`filter-btn ${filter === 'tools' ? 'active' : ''}`}>Web & Tools ⚡</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((p) => (
              <div key={p.id} className="bcard p-6 flex flex-col justify-between" style={{ background: '#fafaf5' }}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="sticker" style={{ background: p.iconBg }}>{p.icon}</div>
                    <div className="flex gap-2">
                      {p.demoUrl && (
                        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="border-2 border-black rounded p-1.5 hover:bg-yellow-200 transition-colors" title="Live Demo">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="border-2 border-black rounded p-1.5 hover:bg-yellow-200 transition-colors" title="GitHub Repository">
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.description}</p>
                </div>

                <div>
                  <button onClick={() => toggleDrawer(p.id)} className="btn btn-outline text-xs w-full mt-2 py-2">
                    <Cpu className="h-4 w-4" /> Architecture & Engineering Breakdown
                  </button>

                  {openDrawers[p.id] && (
                    <div className="project-details-drawer open border-t-2 border-black pt-4 mt-4 space-y-3">
                      {p.problem && <p className="text-xs"><strong>Problem Solved:</strong> {p.problem}</p>}
                      {p.architecture && (
                        <div className="project-architecture-box">
                          <strong>Architecture Pipeline:</strong><br />
                          {p.architecture}
                        </div>
                      )}
                      {p.keyFeatures && (
                        <div className="text-xs">
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
            ))}
          </div>
        </div>
      </section>

      <!-- 05. Experience Section -->
      <section id="experience" className="max-w-6xl mx-auto px-6 py-20">
        <div className="section-label">04 // Experience & Roles</div>
        <h2 className="text-3xl font-bold mb-8">Leadership & Engineering Involvement</h2>

        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="bcard p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold">Coordinator — LOOP Tech Club</h3>
                <span className="tag tag-yellow">2026 - Present</span>
              </div>
              <p className="text-xs mono text-gray-600 mb-3">Galgotias College Developer Community</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Built and maintained the club's event and membership platform using <strong>Next.js and Firebase</strong>.</li>
                <li>Spearheaded community buildathons, open-source hackathons, and technical speaker sessions for 400+ student developers.</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="bcard p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold">Coordinator — GFG Student Chapter</h3>
                <span className="tag tag-pink">2026 - Present</span>
              </div>
              <p className="text-xs mono text-gray-600 mb-3">GeeksforGeeks GCET Chapter</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Organized competitive programming leagues, hands-on cloud development workshops, and mentored 500+ peers in DSA.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 06. Hackathons & Achievements Section -->
      <section id="achievements" className="max-w-6xl mx-auto px-6 py-12 pb-20">
        <div className="section-label">05 // Hackathons & Achievements</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: 'var(--yellow)' }}>🏆</div>
              <h3 class="text-xl font-bold">Hackathons & Competitions</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-b border-gray-200 pb-2">
                <div className="font-bold">Adobe University Hackathon</div>
                <div className="text-xs text-gray-500">Intelligent Workflow Automation • Built AI Agent pipeline</div>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <div className="font-bold">Smart India Hackathon (SIH)</div>
                <div className="text-xs text-gray-500">Smart Campus System • Architecture Lead</div>
              </div>
              <div>
                <div className="font-bold">GIH 2.0 Hackathon</div>
                <div className="text-xs text-gray-500">Real-Time Computer Vision Edge Classifier</div>
              </div>
            </div>
          </div>

          <div className="bcard p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="sticker" style={{ background: '#d6e8ff' }}>☁️</div>
              <h3 className="text-xl font-bold">Cloud & Certifications</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-b border-gray-200 pb-2">
                <div className="font-bold">Google Cloud Gen AI Academy</div>
                <div className="text-xs text-gray-500">Generative AI Models & Vertex AI Vector Search Training</div>
              </div>
              <div>
                <div className="font-bold">GCP Certified Practitioner</div>
                <div className="text-xs text-gray-500">Cloud Run, GKE, IAM & Cloud Architecture Fundamentals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 07. Problem Solving Section -->
      <section id="problem-solving" className="max-w-6xl mx-auto px-6 py-20" style={{ borderTop: 'var(--border)' }}>
        <div className="section-label">06 // Problem Solving</div>
        <h2 className="text-3xl font-bold mb-6">Algorithms & Coding Activity</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bcard p-6 text-center" style={{ background: 'var(--yellow)' }}>
            <div className="text-4xl font-bold mono">250+</div>
            <div className="text-sm font-bold text-gray-800 mt-1">Total Problems Solved</div>
            <div className="text-xs text-gray-600 mt-2">Primary: C++ & Python</div>
          </div>
          <div className="bcard p-6 text-center">
            <div className="text-4xl font-bold mono text-orange-600">180+</div>
            <div className="text-sm font-bold text-gray-800 mt-1">LeetCode Solved</div>
            <div className="text-xs text-gray-500 mt-2">Arrays, Trees, Dynamic Programming</div>
          </div>
          <div className="bcard p-6 text-center">
            <div className="text-4xl font-bold mono text-blue-600">70+</div>
            <div class="text-sm font-bold text-gray-800 mt-1">Codeforces Problems</div>
            <div className="text-xs text-gray-500 mt-2">Contests & Speed Drills</div>
          </div>
        </div>
      </section>

      <!-- 08. Currently Building Section -->
      <section id="building" className="max-w-6xl mx-auto px-6 py-12 pb-20">
        <div className="section-label">07 // Currently Building</div>
        <div className="bcard p-6 bg-white max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-2xl font-bold">Deadline Guardian AI (DG-AI)</h3>
              <p className="text-xs mono text-gray-500">AI-powered deadline risk prediction & recovery engine</p>
            </div>
            <span className="tag tag-yellow">Active Sprint • 85% Completed</span>
          </div>

          <div className="progress-bar-track mb-6">
            <div className="progress-bar-fill" style={{ width: '85%' }}></div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-bold text-black mb-2">Current Sprint Focus:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-yellow-50 p-2 border border-black rounded">✓ Calendar intelligence & event parser</div>
              <div className="bg-yellow-50 p-2 border border-black rounded">✓ Gemini risk prediction model</div>
              <div className="bg-yellow-50 p-2 border border-black rounded">→ Production Cloud Run deployment</div>
              <div className="bg-yellow-50 p-2 border border-black rounded">→ User preference feedback loop</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 09. Resume Section -->
      <section id="resume" className="max-w-6xl mx-auto px-6 py-16 text-center bg-gray-50/80" style={{ borderTop: 'var(--border)' }}>
        <div className="section-label">08 // Resume</div>
        <h2 className="text-3xl font-bold mt-2 mb-4">Want the Full Picture?</h2>
        <p className="text-gray-700 max-w-md mx-auto mb-8 leading-relaxed">
          Download my resume to see a complete summary of my technical experience, engineering projects, and academic background.
        </p>
        <a href="https://github.com/amiitt001" target="_blank" className="btn btn-black py-3 px-8 text-base">
          <FileText className="h-5 w-5" /> Download Resume (PDF)
        </a>
      </section>

      <!-- 10. Contact Section -->
      <section id="contact" style={{ borderTop: 'var(--border)' }} className="bg-yellow-300/20">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="section-label">09 // Let's Talk</div>
            <h2 className="text-4xl font-bold mt-4 mb-4">LET'S BUILD SOMETHING</h2>
            <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">
              Have an interesting project, internship opportunity, or collaboration in mind? My inbox is open.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bcard p-6 bg-white">
              <h3 className="font-bold text-lg mb-4">Send Me a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Your Name</label>
                  <input name="name" type="text" required placeholder="Jane Doe" className="w-full border-2 border-black rounded p-2.5 text-sm focus:bg-yellow-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Your Email</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className="w-full border-2 border-black rounded p-2.5 text-sm focus:bg-yellow-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold mono uppercase mb-1">Message</label>
                  <textarea name="message" rows={4} required placeholder="Let's build..." className="w-full border-2 border-black rounded p-2.5 text-sm focus:bg-yellow-50"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="w-full btn btn-black text-xs py-3">
                  {submitting ? 'Sending...' : 'Send Message 🚀'}
                </button>
              </form>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="bcard p-6 bg-white space-y-4">
                <h3 className="font-bold text-lg">Direct Reach out</h3>
                <div>
                  <div className="text-xs font-bold mono text-gray-500 uppercase">Email Address</div>
                  <a href="mailto:amiitt.v001@gmail.com" className="text-base font-bold text-black hover:underline">amiitt.v001@gmail.com</a>
                </div>
                <div>
                  <div className="text-xs font-bold mono text-gray-500 uppercase">Location</div>
                  <p className="text-sm font-semibold text-gray-800">Greater Noida / NCR, India</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a href="mailto:amiitt.v001@gmail.com" className="btn btn-black">
                  <Mail className="h-4 w-4" /> Email Me
                </a>
                <a href="https://github.com/amiitt001" target="_blank" rel="noopener noreferrer" className="btn btn-yellow">
                  <Github className="h-4 w-4" /> GitHub Profile
                </a>
                <a href="https://www.linkedin.com/in/amiitt001/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <Linkedin className="h-4 w-4" /> LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

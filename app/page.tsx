import Image from 'next/image';
import Link from 'next/link';
import { getProjectsAction } from '@/lib/actions';
import ClientPortfolio from '@/components/ClientPortfolio';

export default async function HomePage() {
  const projects = await getProjectsAction();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navigation ── */}
      <nav>
        <div className="nav-inner">

          {/* Left: Logo + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <Link href="#" className="nav-logo">
              <Image src="/logo.png" alt="Amit Verma" width={32} height={32} />
              AV<span style={{ color: 'var(--yellow)' }}>.</span>
            </Link>
            <div className="status-badge nav-status-hide">
              <span className="status-dot"></span>
              Available for projects &amp; internships
            </div>
          </div>

          {/* Right: Nav links — shown on large screens */}
          <div className="nav-links">
            <a href="#about"           className="nav-link">About</a>
            <a href="#projects"        className="nav-link">Projects</a>
            <a href="#experience"      className="nav-link">Experience</a>
            <a href="#skills"          className="nav-link">Skills</a>
            <a href="#resume"          className="nav-link">Resume</a>
            <a href="#contact"         className="nav-cta">Contact ↗</a>
          </div>

          {/* Mobile: just CTA */}
          <div className="nav-mobile-only">
            <a href="#contact" className="nav-cta">Contact ↗</a>
          </div>

        </div>
      </nav>

      {/* ── Portfolio Content ── */}
      <ClientPortfolio initialProjects={projects} />

      {/* ── Footer ── */}
      <footer style={{ borderTop: 'var(--border)', background: 'var(--white)', padding: '20px 0', marginTop: 'auto' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '13px' }}>
            <Image src="/logo.png" alt="" width={20} height={20} style={{ borderRadius: '4px', border: '1.5px solid var(--black)' }} />
            <span>© 2026 Amit Verma · Built with Brutalist Precision</span>
          </div>
          <a href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, textDecoration: 'none', color: 'var(--black)', border: 'var(--border)', padding: '4px 12px', borderRadius: '4px', boxShadow: 'var(--shadow-secondary)' }}>
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { getProjectsAction } from '@/lib/actions';
import ClientPortfolio from '@/components/ClientPortfolio';

export default async function HomePage() {
  const projects = await getProjectsAction();

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Navigation ── */}
      <nav>
        <div className="nav-inner">
          {/* Left: Logo + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="#" className="nav-logo">
              <Image src="/logo.png" alt="Amit Verma" width={32} height={32} />
              AV<span style={{ color: 'var(--yellow)' }}>.</span>
            </Link>
            <div className="status-badge" style={{ display: 'none' }} id="status-badge-lg">
              <span className="status-dot"></span>
              Available for projects &amp; internships
            </div>
          </div>

          {/* Center/Right: Nav Links (hidden on small screens) */}
          <div className="nav-links" style={{ display: 'none' }}>
            <a href="#about"         className="nav-link">About</a>
            <a href="#skills"        className="nav-link">Skills</a>
            <a href="#projects"      className="nav-link">Projects</a>
            <a href="#experience"    className="nav-link">Experience</a>
            <a href="#achievements"  className="nav-link">Wins</a>
            <a href="#problem-solving" className="nav-link">DSA</a>
            <a href="#resume"        className="nav-link">Resume</a>
            <Link href="/admin"      className="nav-link" style={{ color: 'var(--black)', fontWeight: 700 }}>Admin ⚙</Link>
            <a href="#contact"       className="nav-cta">Say Hello ↗</a>
          </div>

          {/* Mobile CTA */}
          <div className="nav-mobile-cta" style={{ display: 'flex', gap: '8px' }}>
            <a href="#contact" className="nav-cta" style={{ fontSize: '13px', padding: '6px 14px' }}>Say Hello ↗</a>
          </div>
        </div>
      </nav>

      {/* ── Main Portfolio Content ── */}
      <ClientPortfolio initialProjects={projects} />

      {/* ── Footer ── */}
      <footer style={{
        borderTop: 'var(--border)',
        background: 'var(--white)',
        padding: '28px 0',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
            <Image src="/logo.png" alt="" width={22} height={22} style={{ borderRadius: '4px', border: '1.5px solid var(--black)' }} />
            <span>© 2026 Amit Verma · Designed &amp; built with Brutalist Precision ·{' '}
              <Link href="/admin" style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--black)' }}>
                Admin ⚙
              </Link>
            </span>
          </div>
          <a href="#" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            color: 'var(--black)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: 'var(--border)',
            padding: '4px 12px',
            borderRadius: '4px',
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.12s',
          }}>
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

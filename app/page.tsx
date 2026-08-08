import Image from 'next/image';
import Link from 'next/link';
import { getProjectsAction } from '@/lib/actions';
import ClientPortfolio from '@/components/ClientPortfolio';

export default async function HomePage() {
  const projects = await getProjectsAction();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight mono">
              <Image src="/logo.png" alt="Amit Verma Logo" width={36} height={36} className="rounded" />
              <span>AV<span style={{ color: 'var(--yellow)' }}>.</span></span>
            </Link>
            <div className="status-badge hidden lg:inline-flex">
              <span className="status-dot"></span> Available for projects & internships
            </div>
          </div>
          
          <div className="hidden xl:flex items-center gap-2">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#achievements" className="nav-link">Achievements</a>
            <a href="#problem-solving" className="nav-link">DSA</a>
            <a href="#building" className="nav-link">Building</a>
            <a href="#resume" className="nav-link">Resume</a>
            <Link href="/admin" className="nav-link font-bold text-yellow-600" title="Admin Dashboard">Admin ⚙️</Link>
            <a href="#contact" className="nav-cta">Say Hello ↗</a>
          </div>
        </div>
      </nav>

      {/* Main Interactive Portfolio Content */}
      <ClientPortfolio initialProjects={projects} />

      {/* Footer */}
      <footer className="border-t border-black py-8 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Amit Verma Logo" width={24} height={24} className="rounded" />
            <p>© 2026 Amit Verma. Designed & Built with Brutalist Precision. • <Link href="/admin" className="underline font-semibold hover:text-black">Admin Dashboard ⚙️</Link></p>
          </div>
          <a href="#home" className="hover:underline mono font-semibold flex items-center gap-1">
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

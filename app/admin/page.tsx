import Image from 'next/image';
import Link from 'next/link';
import { getProjectsAction, getContactMessagesAction } from '@/lib/actions';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminPage() {
  const projects = await getProjectsAction();
  const messages = await getContactMessagesAction();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mono">
              <Image src="/logo.png" alt="Amit Verma Logo" width={32} height={32} className="rounded" />
              <span>AV<span style={{ color: 'var(--yellow)' }}>.</span> Admin</span>
            </Link>
            <span className="tag tag-yellow">Next.js 16 Dashboard</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="btn btn-outline text-xs py-2 px-3">
              View Portfolio ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Client Admin Component */}
      <AdminDashboardClient initialProjects={projects} initialMessages={messages} />

      {/* Footer */}
      <footer className="bg-white border-t-2 border-black py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AV Logo" width={20} height={20} />
            <span>Portfolio Admin Dashboard • Next.js App Router + Prisma</span>
          </div>
          <Link href="/" className="underline font-bold text-black">Return to Main Portfolio</Link>
        </div>
      </footer>
    </div>
  );
}

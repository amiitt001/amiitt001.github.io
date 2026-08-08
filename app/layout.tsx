import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Amit Verma — AI & Full-Stack Engineer',
  description: 'Portfolio of Amit Verma — Computer Science student building production-focused AI applications, developer tools, and scalable web systems.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Amit Verma — AI & Full-Stack Engineer',
    description: 'I build intelligent software at the intersection of AI, engineering, and automation.',
    url: 'https://amiitt001.github.io',
    siteName: 'Amit Verma Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}>
        <div id="scroll-progress"></div>
        {children}
      </body>
    </html>
  );
}

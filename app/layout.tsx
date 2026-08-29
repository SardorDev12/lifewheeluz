import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Muvozanat — Hayot g‘ildiragi va maqsadlar',
  description: 'Hayotingizni baholang, uzoq muddatli maqsadlarni rejalashtiring va har hafta oldinga siljing.',
  openGraph: {
    title: 'Muvozanat',
    description: 'Life, intentionally. Hayotingizni baholang va uzoq muddatli maqsadlarni amaliy qadamlar bilan boshqaring.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Muvozanat — Life, intentionally' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muvozanat',
    description: 'Life, intentionally.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}

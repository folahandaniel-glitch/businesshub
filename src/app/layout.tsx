import type { Metadata } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { siteConfig } from '@/lib/site-config';
import { getSiteSettings } from '@/lib/queries';

const display = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Laptops, computers and office technology in Nigeria`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.tagline,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    locale: 'en_NG'
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Contact details and social links are managed by the Super Admin.
  const { contact, socials } = await getSiteSettings();

  return (
    <html lang="en-NG" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header phone={contact?.primaryPhone ?? ''} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact ?? undefined} socials={socials} />
      </body>
    </html>
  );
}

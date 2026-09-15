import type { Metadata } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { siteConfig } from '@/lib/site-config';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /*
   * Contact and social values are read from the database in stage 2,
   * once the settings modules are wired. The fallbacks below keep a
   * fresh install renderable.
   */
  const contact = {
    primaryPhone: '0803 000 0000',
    whatsappNumber: '0803 000 0000',
    email: 'sales@businesshubcomputers.com',
    address: 'Head office address, Nigeria',
    openingHours: 'Monday to Saturday, 8:00am to 6:00pm'
  };

  return (
    <html lang="en-NG" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header phone={contact.primaryPhone} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} socials={[]} />
      </body>
    </html>
  );
}

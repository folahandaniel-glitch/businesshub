import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { siteConfig, footerLinks } from '@/lib/site-config';

export type FooterContact = {
  primaryPhone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  address?: string | null;
  openingHours?: string | null;
};

export type FooterSocial = { platform: string; url: string };

/**
 * Contact details and social links arrive from the database so the
 * Super Admin controls them from the backend. Nothing here is hardcoded
 * beyond safe fallbacks for a fresh install.
 */
export function Footer({
  contact,
  socials = []
}: {
  contact?: FooterContact;
  socials?: FooterSocial[];
}) {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="inline-block rounded-card bg-white p-3">
            <Image src="/logo.jpeg" alt="Business-Hub Computers" width={220} height={52} className="h-10 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{siteConfig.tagline}</p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-white/90">{siteConfig.registrationNumber}</p>
          {socials.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-card border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 transition-colors hover:border-scarlet hover:bg-scarlet hover:text-white"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <FooterColumn title="Quick links" links={footerLinks.quickLinks} />
        <FooterColumn title="Customer service" links={footerLinks.customerService} />

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {contact?.primaryPhone ? (
              <ContactRow icon={<Phone size={15} />} href={`tel:${contact.primaryPhone}`} text={contact.primaryPhone} />
            ) : null}
            {contact?.whatsappNumber ? (
              <ContactRow
                icon={<MessageCircle size={15} />}
                href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`}
                text={`WhatsApp ${contact.whatsappNumber}`}
              />
            ) : null}
            {contact?.email ? (
              <ContactRow icon={<Mail size={15} />} href={`mailto:${contact.email}`} text={contact.email} />
            ) : null}
            {contact?.address ? <ContactRow icon={<MapPin size={15} />} text={contact.address} /> : null}
            {contact?.openingHours ? <ContactRow icon={<Clock size={15} />} text={contact.openingHours} /> : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. {siteConfig.registrationNumber}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const body = (
    <span className="flex gap-2.5">
      <span className="mt-0.5 shrink-0 text-scarlet" aria-hidden>
        {icon}
      </span>
      <span>{text}</span>
    </span>
  );
  return <li>{href ? <a href={href} className="transition-colors hover:text-white">{body}</a> : body}</li>;
}

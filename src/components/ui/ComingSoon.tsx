import { ButtonLink } from './Button';

/**
 * Used only for pages whose real functionality needs backend work not yet
 * built (cart persistence, authentication). Honest about what stage they
 * land in, rather than a silent 404 or a form that pretends to work.
 */
export function ComingSoon({
  icon,
  title,
  body,
  stage
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  stage: string;
}) {
  return (
    <div className="shell py-16">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-line bg-white p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
          {icon}
        </span>
        <h1 className="mt-5 text-xl font-bold text-ink">{title}</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-slate">{body}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">{stage}</p>
        <ButtonLink href="/shop" className="mt-6" size="md">
          Continue shopping
        </ButtonLink>
      </div>
    </div>
  );
}

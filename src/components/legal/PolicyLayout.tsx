export function PolicyLayout({
  title,
  updated,
  children
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-slate">{updated}</p>
        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-deep">{children}</p>
    </section>
  );
}

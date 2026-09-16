export function SpecTable({ specs }: { specs: Record<string, string> | null }) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card border border-line">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(specs).map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-mist'}>
              <th scope="row" className="w-2/5 px-4 py-2.5 text-left font-semibold text-slate-deep">
                {label}
              </th>
              <td className="px-4 py-2.5 text-ink">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

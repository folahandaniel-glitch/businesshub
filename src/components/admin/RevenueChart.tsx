'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatNaira } from '@/lib/utils';

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const displayData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
  }));

  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Revenue, last 30 days</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#17359B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#17359B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E7F1" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#5A6784' }}
              tickLine={false}
              axisLine={{ stroke: '#E2E7F1' }}
              interval={Math.ceil(displayData.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#5A6784' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
              width={40}
            />
            <Tooltip
              formatter={(value: number) => [formatNaira(value), 'Revenue']}
              labelStyle={{ color: '#0A1B4D', fontWeight: 600 }}
              contentStyle={{ borderRadius: 10, borderColor: '#E2E7F1', fontSize: 13 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#17359B" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

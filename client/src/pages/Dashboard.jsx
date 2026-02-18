import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';

/* ===================== PayTrack • Bluish Dashboard Theme (NO mirror / NO glass) ===================== */
const styles = `
.pt-dashboard{
  --bg0:#050b14;
  --bg1:#071428;
  --bg2:#0a1f3b;

  --ink:#f2f7ff;
  --muted:rgba(242,247,255,.72);

  --b1:#38bdf8;
  --b2:#60a5fa;
  --b3:#a5f3fc;

  --stroke:rgba(255,255,255,.14);

  /* ✅ solid (non-glass) panels */
  --panel: rgba(10,18,34,.92);
  --panel2: rgba(8,16,30,.90);

  --shadow:0 26px 80px rgba(0,0,0,.52);
  --shadow2:0 14px 46px rgba(0,0,0,.38);

  --r:22px;
  --ease:cubic-bezier(.2,.9,.2,1);

  min-height:100vh;
  padding:22px;
  color:var(--ink);
  position:relative;
  overflow:hidden;

  background:
    radial-gradient(1100px 760px at 12% 12%, rgba(56,189,248,.18), transparent 60%),
    radial-gradient(900px 650px at 86% 20%, rgba(96,165,250,.14), transparent 55%),
    radial-gradient(900px 700px at 55% 92%, rgba(165,243,252,.10), transparent 55%),
    linear-gradient(140deg, var(--bg0) 0%, var(--bg1) 55%, #040812 100%);
}

/* subtle dots are fine (not mirror) */
.pt-dashboard::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity:.16;
  pointer-events:none;
}

/* ✅ removed mirror/aurora animated blob (pt-dashboard::after + keyframes) */

.pt-row{
  display:flex;
  flex-wrap:wrap;
  gap:16px;
  position:relative;
  z-index:1;
}

.pt-card{
  border-radius: var(--r);
  border: 1px solid var(--stroke);

  /* ✅ solid panel background */
  background: var(--panel);

  /* ✅ remove glass blur */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  box-shadow: var(--shadow2);
  padding:18px;
  position:relative;
  overflow:hidden;

  /* ✅ keep subtle hover but no shimmer */
  transition: transform 220ms var(--ease), box-shadow 220ms var(--ease);
}

/* ✅ removed shimmer/mirror highlight */
.pt-card::before{ content:none; }

.pt-card:hover{
  transform: translateY(-2px);
  box-shadow: 0 22px 70px rgba(0,0,0,.46);
}

.pt-h3{ margin:0 0 12px 0; font-size:16px; letter-spacing:.2px; }
.pt-small{ font-size:12px; color: rgba(242,247,255,.62); }

.pt-subTitle{
  margin: 0 0 8px 0;
  font-size: 13px;
  letter-spacing: .2px;
  color: rgba(242,247,255,.86);
}
.pt-divider{
  height: 1px;
  background: rgba(255,255,255,.10);
  margin: 10px 0 12px;
}

.pt-pieStack{
  display:grid;
  gap: 14px;
}

.pt-totalsRow{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
}

.pt-metric{
  flex:1 1 160px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.12);

  /* ✅ solid inner panels */
  background: var(--panel2);

  padding:12px;
  transition: transform 180ms var(--ease);
}
.pt-metric:hover{ transform: translateY(-2px); }

.pt-metricLabel{ font-size:12px; color: rgba(242,247,255,.62); }
.pt-metricValue{
  font-size:26px;
  font-weight:900;
  letter-spacing:.2px;
  margin-top:6px;
  background: linear-gradient(90deg, rgba(165,243,252,1), rgba(96,165,250,1), rgba(56,189,248,1));
  -webkit-background-clip:text;
  background-clip:text;
  color: transparent;
}

.pt-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .15px;
}
.pt-badgeDot{
  width: 8px; height: 8px; border-radius: 999px;
  background: linear-gradient(135deg, rgba(56,189,248,1), rgba(165,243,252,1));
}

.pt-table{
  width:100%;
  border-collapse:collapse;
  border-radius:16px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.03);
}
.pt-table th, .pt-table td{
  text-align:left;
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  font-size: 13px;
  color: rgba(242,247,255,.86);
}
.pt-table th{
  font-size:12px;
  color: rgba(242,247,255,.66);
  letter-spacing:.25px;
  background: rgba(255,255,255,.04);
}
.pt-table tr:hover td{ background: rgba(255,255,255,.05); }

.pt-error{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(165,243,252,.22);
  background: rgba(165,243,252,.10);
  color: rgba(235,252,255,.92);
  font-size: 13px;
}

/* recharts polish */
.pt-recharts .recharts-cartesian-grid line,
.pt-recharts .recharts-cartesian-grid path{
  stroke: rgba(255,255,255,.08) !important;
}
.pt-recharts .recharts-text{
  fill: rgba(242,247,255,.72) !important;
}

/* Tooltip theme (no blur) */
.pt-tooltip{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(5,12,22,.92);
  box-shadow: 0 18px 46px rgba(0,0,0,.42);
  padding: 10px 12px;
  color: rgba(242,247,255,.92);
  font-size: 12px;
  min-width: 140px;
}
.pt-tooltipTitle{
  font-weight: 900;
  letter-spacing: .2px;
  margin-bottom: 6px;
  background: linear-gradient(90deg, rgba(165,243,252,1), rgba(96,165,250,1), rgba(56,189,248,1));
  -webkit-background-clip:text;
  background-clip:text;
  color: transparent;
}
.pt-tooltipRow{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 2px 0;
}
.pt-tooltipKey{ opacity:.78; }
.pt-tooltipVal{ font-weight: 900; }
`;

/* Bluish palette for Pie slices */
const PIE_COLORS = [
  '#38bdf8',
  '#60a5fa',
  '#a5f3fc',
  '#3b82f6',
  '#0ea5e9',
  '#93c5fd',
  '#67e8f9',
  '#2563eb'
];

const BAR_GRADIENT_ID = 'ptBarGrad';

/* Custom tooltip component */
function ThemedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pt-tooltip">
      <div className="pt-tooltipTitle">{label}</div>
      {payload.map((p, idx) => (
        <div className="pt-tooltipRow" key={idx}>
          <div className="pt-tooltipKey">{p.name || 'Value'}</div>
          <div className="pt-tooltipVal">₹{Number(p.value || 0).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setLoading(true);
      try {
        const [o, h] = await Promise.all([
          api.get('/summary/overview'),
          api.get('/history', { params: { limit: 10 } })
        ]);
        setOverview(o.data);
        setHistory(h.data.items || []);
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="pt-dashboard">
          <div className="pt-card">Loading dashboard…</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="pt-dashboard">
          <div className="pt-card">
            <div className="pt-error">{error}</div>
          </div>
        </div>
      </>
    );
  }

  const totals = overview?.totals || { income: '0.00', expense: '0.00', balance: '0.00' };

  const barData = [
    { name: 'Income', value: Number(totals.income) },
    { name: 'Expense', value: Number(totals.expense) }
  ];

  const incomePie = (overview?.incomeByCategory || []).slice(0, 8).map(x => ({
    name: x.category,
    value: Number(x.total)
  }));

  const expensePie = (overview?.expenseByCategory || []).slice(0, 8).map(x => ({
    name: x.category,
    value: Number(x.total)
  }));

  return (
    <>
      <style>{styles}</style>

      <div className="pt-dashboard">
        <div className="pt-row">
          {/* Totals */}
          <div className="pt-card" style={{ flex: '1 1 260px' }}>
            <h3 className="pt-h3">Totals</h3>

            <div className="pt-totalsRow">
              <div className="pt-metric">
                <div className="pt-metricLabel">Income</div>
                <div className="pt-metricValue">₹{totals.income}</div>
              </div>

              <div className="pt-metric">
                <div className="pt-metricLabel">Expense</div>
                <div className="pt-metricValue">₹{totals.expense}</div>
              </div>

              <div className="pt-metric">
                <div className="pt-metricLabel">Balance</div>
                <div className="pt-metricValue">₹{totals.balance}</div>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="pt-recharts" style={{ height: 240, marginTop: 16 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <defs>
                    <linearGradient id={BAR_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.70} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ThemedTooltip />} />
                  <Bar
                    dataKey="value"
                    name="Amount"
                    fill={`url(#${BAR_GRADIENT_ID})`}
                    stroke="#a5f3fc"
                    strokeOpacity={0.35}
                    radius={[12, 12, 8, 8]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Card (Income pie ABOVE Expense pie) */}
          <div className="pt-card" style={{ flex: '1 1 360px' }}>
            <h3 className="pt-h3">Categories overview</h3>

            <div className="pt-pieStack">
              {/* INCOME PIE */}
              <div>
                <div className="pt-subTitle">Income by category</div>
                <div className="pt-recharts" style={{ height: 240 }}>
                  {incomePie.length ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={incomePie}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          innerRadius={46}
                          stroke="rgba(255,255,255,0.16)"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {incomePie.map((_, idx) => (
                            <Cell key={`inc-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ThemedTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="pt-small" style={{ paddingTop: 10 }}>
                      No income categories yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-divider" />

              {/* EXPENSE PIE */}
              <div>
                <div className="pt-subTitle">Expenses by category</div>
                <div className="pt-recharts" style={{ height: 240 }}>
                  {expensePie.length ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={expensePie}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          innerRadius={46}
                          stroke="rgba(255,255,255,0.16)"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {expensePie.map((_, idx) => (
                            <Cell key={`exp-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ThemedTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="pt-small" style={{ paddingTop: 10 }}>
                      No expense categories yet.
                    </div>
                  )}
                </div>

                <div className="pt-small">Top categories only (up to 8) for readability.</div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="pt-card" style={{ flex: '1 1 100%' }}>
            <h3 className="pt-h3">Recent history</h3>

            <table className="pt-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.type + ':' + h.id}>
                    <td>
                      <span className="pt-badge">
                        <span className="pt-badgeDot" />
                        {h.type}
                      </span>
                    </td>
                    <td>₹{h.amount}</td>
                    <td>{h.category}</td>
                    <td>{h.description}</td>
                    <td>{String(h.date).slice(0, 10)}</td>
                  </tr>
                ))}
                {!history.length && (
                  <tr>
                    <td colSpan={5} className="pt-small" style={{ padding: 14 }}>
                      No data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

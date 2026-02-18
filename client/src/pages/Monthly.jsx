import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

/* Use LOCAL month (avoids UTC edge-cases) */
function currentMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`; // YYYY-MM (required by <input type="month" />)
}


const styles = `
.pt-monthly{
  --bg0:#050b14;
  --bg1:#071428;
  --bg2:#0a1f3b;

  --ink:#f2f7ff;
  --muted:rgba(242,247,255,.70);

  --b1:#38bdf8;  /* sky */
  --b2:#60a5fa;  /* blue */
  --b3:#a5f3fc;  /* cyan */

  --stroke:rgba(255,255,255,.14);
  --glass:rgba(255,255,255,.08);
  --glass2:rgba(255,255,255,.12);

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


.pt-monthly::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity:.16;
  pointer-events:none;
}


   - removed .pt-monthly::after
   - removed @keyframes ptFloat
*/

/* card */
.pt-card{
  border-radius: var(--r);
  border: 1px solid var(--stroke);
  background: var(--glass);

  
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  box-shadow: var(--shadow2);
  padding:18px;
  position:relative;
  overflow:hidden;
  transition: transform 260ms var(--ease), box-shadow 260ms var(--ease), background 260ms var(--ease);
  z-index:1;
}


.pt-card::before{ content:none; }

/* ensure all real content stays above */
.pt-card > *{
  position:relative;
  z-index:1;
}

.pt-card:hover{
  transform: translateY(-3px);
  background: var(--glass2);
  box-shadow: 0 22px 70px rgba(0,0,0,.46);
}

.pt-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  flex-wrap:wrap;
}

.pt-h3{ margin:0; font-size:16px; letter-spacing:.2px; }
.pt-small{ font-size:12px; color: rgba(242,247,255,.62); }

.pt-monthPicker{
  display:flex;
  align-items:center;
  gap: 10px;
}

.pt-input{
  height: 42px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(3,10,18,.52);
  color: var(--ink);
  outline:none;
  cursor: pointer;
  transition: transform 180ms var(--ease), border-color 180ms var(--ease), box-shadow 180ms var(--ease), background 180ms var(--ease);
}
.pt-input:focus{
  border-color: rgba(96,165,250,.78);
  background: rgba(3,10,18,.66);
  box-shadow: 0 0 0 5px rgba(96,165,250,.18);
  transform: translateY(-1px);
}

/* recharts polish */
.pt-recharts .recharts-cartesian-grid line,
.pt-recharts .recharts-cartesian-grid path{
  stroke: rgba(255,255,255,.08) !important;
}
.pt-recharts .recharts-text,
.pt-recharts .recharts-legend-item-text{
  fill: rgba(242,247,255,.72) !important;
}

/* themed tooltip */
.pt-tooltip{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(5,12,22,.82);

  /* keep tooltip blur if you want; this is not the "mirror" effect */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 18px 46px rgba(0,0,0,.42);
  padding: 10px 12px;
  color: rgba(242,247,255,.92);
  font-size: 12px;
  min-width: 160px;
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

.pt-error{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(248,113,113,.22);
  background: rgba(248,113,113,.10);
  color: rgba(255,230,230,.92);
  font-size: 13px;
}

@media (max-width: 720px){
  .pt-monthly{ padding: 16px; }
  .pt-card{ padding: 14px; }
}
`;

/* Custom tooltip component */
function ThemedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="pt-tooltip">
      <div className="pt-tooltipTitle">Day {label}</div>
      {payload.map((p, idx) => (
        <div className="pt-tooltipRow" key={idx}>
          <div className="pt-tooltipKey">{p.name}</div>
          <div className="pt-tooltipVal">₹{Number(p.value || 0).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default function Monthly() {
  const [month, setMonth] = useState(currentMonth());
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setLoading(true);
      try {
        const res = await api.get('/summary/monthly', { params: { month } });
        const d = res.data.days || [];
        setDays(
          d.map(x => ({
            date: x.date.slice(8, 10),
            income: Number(x.income),
            expense: Number(x.expense)
          }))
        );
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load monthly summary');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [month]);

  return (
    <>
      <style>{styles}</style>

      <div className="pt-monthly">
        <div className="pt-card">
          <div className="pt-row">
            <h3 className="pt-h3">Monthly summary</h3>

            <div className="pt-monthPicker">
              <span className="pt-small">Month:</span>
              <input
                className="pt-input"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="pt-small" style={{ marginTop: 12 }}>Loading…</div>
          ) : error ? (
            <div className="pt-error" style={{ marginTop: 12 }}>{error}</div>
          ) : (
            <div className="pt-recharts" style={{ height: 360, marginTop: 12 }}>
              <ResponsiveContainer>
                <LineChart data={days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ThemedTooltip />} />
                  <Legend />
                  <Line dataKey="income" name="Income" type="monotone" stroke="#38bdf8" strokeWidth={3} dot={false} />
                  <Line dataKey="expense" name="Expense" type="monotone" stroke="#60a5fa" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="pt-small" style={{ marginTop: 10 }}>
            Tip: add more entries across different dates to see a more interesting chart.
          </div>
        </div>
      </div>
    </>
  );
}

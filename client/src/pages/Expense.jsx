import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { clearPending, loadPending, makeIdempotencyKey, savePending } from '../api/idempotent';

const PENDING_KEY = 'pf_pending_expense';

/* ===================== PayTrack • Bluish Expense Page Theme (same file) ===================== */
const styles = `
.pt-expense{
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

/* dotted overlay */
.pt-expense::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity:.16;
  pointer-events:none;
}

/* floating glow */
.pt-expense::after{
  content:"";
  position:absolute;
  width: 860px;
  height: 860px;
  right: -280px;
  top: -320px;
  background:
    radial-gradient(circle at 30% 30%, rgba(56,189,248,.46), transparent 60%),
    radial-gradient(circle at 65% 38%, rgba(96,165,250,.26), transparent 62%),
    radial-gradient(circle at 48% 75%, rgba(165,243,252,.20), transparent 62%);
  filter: blur(48px);
  opacity:.38;
  animation: ptFloat 10s var(--ease) infinite;
  pointer-events:none;
}
@keyframes ptFloat{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(-22px, 22px) scale(1.03); }
}

.pt-row{
  display:flex;
  flex-wrap:wrap;
  gap:16px;
  position:relative;
  z-index:1;
}

/* cards */
.pt-card{
  border-radius: var(--r);
  border: 1px solid var(--stroke);
  background: var(--glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow2);
  padding:18px;
  position:relative;
  overflow:hidden;
  transition: transform 260ms var(--ease), box-shadow 260ms var(--ease), background 260ms var(--ease);
}
.pt-card::before{
  content:"";
  position:absolute;
  inset:-40%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.22) 35%, transparent 70%);
  transform: translateX(-30%) rotate(10deg);
  opacity: 0;
  transition: opacity 260ms var(--ease), transform 520ms var(--ease);
}
.pt-card:hover{
  transform: translateY(-3px);
  background: var(--glass2);
  box-shadow: 0 22px 70px rgba(0,0,0,.46);
}
.pt-card:hover::before{
  opacity: 1;
  transform: translateX(30%) rotate(10deg);
}

.pt-h3{ margin:0 0 12px 0; font-size:16px; letter-spacing:.2px; }
.pt-small{ font-size:12px; color: rgba(242,247,255,.62); }

/* form */
.pt-form{
  display:grid;
  gap: 10px;
}
.pt-formRow{
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
}

.pt-input, .pt-select{
  flex: 1 1 200px;
  height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(3,10,18,.52);
  color: var(--ink);
  outline:none;
  transition: transform 180ms var(--ease), border-color 180ms var(--ease), box-shadow 180ms var(--ease), background 180ms var(--ease);
}
.pt-input::placeholder{ color: rgba(242,247,255,.42); }
.pt-input:focus, .pt-select:focus{
  border-color: rgba(96,165,250,.78);
  background: rgba(3,10,18,.66);
  box-shadow: 0 0 0 5px rgba(96,165,250,.18);
  transform: translateY(-1px);
}

.pt-btn{
  height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.16);
  background: linear-gradient(135deg, rgba(56,189,248,.95), rgba(96,165,250,.85));
  color:#fff;
  font-weight: 900;
  letter-spacing: .2px;
  cursor:pointer;
  box-shadow: 0 14px 30px rgba(0,0,0,.34);
  position:relative;
  overflow:hidden;
  transform: translateY(0);
  transition: transform 180ms var(--ease), box-shadow 180ms var(--ease), filter 180ms var(--ease);
}
.pt-btn::after{
  content:"";
  position:absolute;
  top:-30%;
  left:-60%;
  width: 60%;
  height: 160%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 45%, transparent 90%);
  transform: rotate(18deg);
  transition: left 420ms var(--ease);
}
.pt-btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(0,0,0,.44);
  filter: saturate(1.08);
}
.pt-btn:hover::after{ left: 120%; }
.pt-btn:active{ transform: translateY(0) scale(.99); }
.pt-btn:disabled{ opacity:.72; cursor:not-allowed; filter: grayscale(.15); }

.pt-actions{
  margin-top: 6px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  flex-wrap:wrap;
}

.pt-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.08);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .15px;
}
.pt-badgeDot{
  width: 8px; height: 8px; border-radius: 999px;
  background: linear-gradient(135deg, rgba(56,189,248,1), rgba(165,243,252,1));
}

/* status messages */
.pt-error{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(248,113,113,.22);
  background: rgba(248,113,113,.10);
  color: rgba(255,230,230,.92);
  font-size: 13px;
}
.pt-success{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(165,243,252,.22);
  background: rgba(165,243,252,.10);
  color: rgba(235,252,255,.92);
  font-size: 13px;
}

/* table */
.pt-table{
  width:100%;
  border-collapse:collapse;
  border-radius:16px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
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

@media (max-width: 860px){
  .pt-expense{ padding: 16px; }
  .pt-card{ padding: 14px; }
}
`;

export default function Expense() {
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [idempotencyKey, setIdempotencyKey] = useState(makeIdempotencyKey());

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: '0.00', count: 0 });
  const [filterCategory, setFilterCategory] = useState('');
  const [sort, setSort] = useState('date_desc');

  const [loadingList, setLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const categories = useMemo(() => {
    const set = new Set(items.map(x => x.category));
    return ['', ...Array.from(set).sort()];
  }, [items]);

  async function fetchList() {
    setLoadingList(true);
    setError('');
    try {
      const res = await api.get('/expenses', {
        params: {
          category: filterCategory || undefined,
          sort
        }
      });
      setItems(res.data.items || []);
      setMeta(res.data.meta || { total: '0.00', count: 0 });
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, sort]);

  // If the user refreshed after submitting, try to re-send safely (same Idempotency-Key).
  useEffect(() => {
    const pending = loadPending(PENDING_KEY);
    if (!pending) return;

    (async () => {
      try {
        setMessage('Retrying last expense submission…');
        await api.post('/expenses', pending.payload, {
          headers: { 'Idempotency-Key': pending.idempotencyKey }
        });
        clearPending(PENDING_KEY);
        setMessage('Last expense saved (retry-safe).');
        await fetchList();
      } catch {
        setMessage('Pending expense submission still not confirmed. You can submit again.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoadingSubmit(true);

    const payload = { ...form };

    try {
      // Save pending so refresh/retry remains safe.
      savePending(PENDING_KEY, { idempotencyKey, payload, at: Date.now() });

      const res = await api.post('/expenses', payload, {
        headers: { 'Idempotency-Key': idempotencyKey }
      });

      clearPending(PENDING_KEY);
      setMessage(res.data.replay ? 'Already saved earlier (retry detected).' : 'Expense saved.');
      setForm({ amount: '', category: '', description: '', date: '' });
      setIdempotencyKey(makeIdempotencyKey());
      await fetchList();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save expense');
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="pt-expense">
        <div className="pt-row">
          {/* Add Expense */}
          <div className="pt-card" style={{ flex: '1 1 340px' }}>
            <h3 className="pt-h3">Add expense</h3>

            <form onSubmit={submit} className="pt-form">
              <div className="pt-formRow">
                <input
                  className="pt-input"
                  placeholder="Amount (e.g. 199.99)"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                />
                <input
                  className="pt-input"
                  placeholder="Category (e.g. Food)"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  required
                />
              </div>

              <div className="pt-formRow">
                <input
                  className="pt-input"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div className="pt-formRow">
                <input
                  className="pt-input"
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>

              {error && <div className="pt-error" style={{ marginTop: 4 }}>{error}</div>}
              {message && <div className="pt-success" style={{ marginTop: 4 }}>{message}</div>}

              <div className="pt-actions">
                <button className="pt-btn" disabled={loadingSubmit} type="submit">
                  {loadingSubmit ? 'Saving…' : 'Submit'}
                </button>
                <div className="pt-small">Retry-safe: multiple clicks/refresh won’t duplicate.</div>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="pt-card" style={{ flex: '1 1 560px' }}>
            <div className="pt-row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <h3 className="pt-h3" style={{ margin: 0 }}>Expenses</h3>

              <div className="pt-formRow" style={{ justifyContent: 'flex-end' }}>
                <select className="pt-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  {categories.map(c => (
                    <option key={c || 'all'} value={c}>
                      {c ? `Category: ${c}` : 'All categories'}
                    </option>
                  ))}
                </select>

                <select className="pt-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="date_desc">Sort: Newest date</option>
                  <option value="created_desc">Sort: Created time</option>
                </select>

                <button className="pt-btn" onClick={fetchList} type="button" style={{ flex: '0 0 auto' }}>
                  Refresh
                </button>
              </div>
            </div>

            <div className="pt-small" style={{ marginTop: 10 }}>
              Total (visible list):{' '}
              <span className="pt-badge">
                <span className="pt-badgeDot" /> ₹{meta.total}
              </span>{' '}
              · Count: {meta.count}
            </div>

            <div style={{ marginTop: 12 }}>
              {loadingList ? (
                <div className="pt-small">Loading…</div>
              ) : (
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(x => (
                      <tr key={x.id}>
                        <td>₹{x.amount}</td>
                        <td>{x.category}</td>
                        <td>{x.description}</td>
                        <td>{String(x.date).slice(0, 10)}</td>
                      </tr>
                    ))}
                    {!items.length && (
                      <tr>
                        <td colSpan={4} className="pt-small" style={{ padding: 14 }}>
                          No expenses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

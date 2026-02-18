import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const styles = `
/* ===================== PayTrack • Minimal Bluish Split Login ===================== */
.pt-page{
  --bg0:#050b14;
  --bg1:#071428;

  --ink:#f2f7ff;
  --muted:rgba(242,247,255,.72);

  --b1:#38bdf8;   /* sky */
  --b2:#60a5fa;   /* blue */
  --stroke:rgba(255,255,255,.14);

  --panel: rgba(10,18,34,.92);
  --panel2: rgba(8,16,30,.90);

  --shadow: 0 18px 60px rgba(0,0,0,.55);
  --r: 22px;
  --r2: 14px;

  min-height:100vh;
  display:grid;
  place-items:center;
  padding:28px;
  color:var(--ink);
  background:
    radial-gradient(900px 600px at 15% 15%, rgba(56,189,248,.18), transparent 60%),
    radial-gradient(900px 600px at 85% 20%, rgba(96,165,250,.14), transparent 60%),
    linear-gradient(140deg, var(--bg0) 0%, var(--bg1) 70%, #040812 100%);
}

.pt-shell{
  width:min(1120px, 96vw);
  min-height: 660px;
  border-radius: var(--r);
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.04);
  box-shadow: var(--shadow);
  overflow:hidden;
  display:grid;
  grid-template-columns: 1.1fr .9fr;
}

/* LEFT */
.pt-left{
  padding: 42px;
  border-right: 1px solid rgba(255,255,255,.08);
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,.02);
}

.pt-heroCard{
  width: 100%;
  border-radius: var(--r);
  border: 1px solid rgba(255,255,255,.10);
  background: var(--panel2);
  padding: 18px;
  box-shadow: 0 12px 30px rgba(0,0,0,.35);
}

.pt-heroTitle{
  margin: 10px 2px 0;
  font-size: 18px;
  letter-spacing: .2px;
}

/* RIGHT */
.pt-right{
  padding: 42px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,.02);
}

.pt-formWrap{
  width:100%;
  max-width: 430px;
  border-radius: var(--r);
  border: 1px solid rgba(255,255,255,.12);
  background: var(--panel);
  padding: 22px;
  box-shadow: 0 12px 30px rgba(0,0,0,.38);
}

.pt-brandTop{
  text-align:center;
  margin-bottom: 14px;
}

.pt-brandName{
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: .3px;
  color: var(--ink);
}

.pt-welcome{
  margin: 8px 0 0;
  font-size: 13px;
  color: rgba(242,247,255,.75);
}

.pt-form{
  display:grid;
  gap: 12px;
  margin-top: 14px;
}

.pt-field{ display:grid; gap: 7px; }

.pt-label{
  font-size: 12px;
  color: rgba(242,247,255,.70);
  letter-spacing: .3px;
}

.pt-input{
  height: 46px;
  padding: 0 14px;
  border-radius: var(--r2);
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(3,10,18,.65);
  color: var(--ink);
  outline:none;
}
.pt-input::placeholder{ color: rgba(242,247,255,.42); }
.pt-input:focus{
  border-color: rgba(96,165,250,.70);
  box-shadow: 0 0 0 4px rgba(96,165,250,.16);
}

.pt-error{
  padding: 10px 12px;
  border-radius: var(--r2);
  border: 1px solid rgba(56,189,248,.25);
  background: rgba(56,189,248,.10);
  color: rgba(242,247,255,.92);
  font-size: 13px;
}

.pt-actions{
  margin-top: 6px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}

.pt-btn{
  height: 44px;
  padding: 0 16px;
  border-radius: var(--r2);
  border: 1px solid rgba(255,255,255,.10);
  background: linear-gradient(135deg, var(--b1), var(--b2));
  color:#031018;
  font-weight: 900;
  letter-spacing: .2px;
  cursor:pointer;
}
.pt-btn:disabled{ opacity:.72; cursor:not-allowed; }

.pt-link{
  color: rgba(242,247,255,.86);
  text-decoration:none;
  font-weight: 800;
}
.pt-link:hover{ color: #fff; }

/* Responsive */
@media (max-width: 900px){
  .pt-shell{ grid-template-columns: 1fr; min-height: auto; }
  .pt-left{
    padding: 28px;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .pt-right{ padding: 28px; }
}
`;

/* Inline illustration stays the same */
function ExpenseTrackerIllustration() {
  return (
    <svg viewBox="0 0 920 520" width="100%" height="auto" role="img" aria-label="Personal expense tracker illustration">
      <defs>
        <linearGradient id="ptGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(56,189,248,0.95)" />
          <stop offset="1" stopColor="rgba(96,165,250,0.75)" />
        </linearGradient>
        <linearGradient id="ptGlass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <filter id="ptShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="rgba(0,0,0,0.45)" />
        </filter>
      </defs>

      <rect x="32" y="30" rx="26" ry="26" width="856" height="460" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" filter="url(#ptShadow)" />

      <rect x="70" y="70" rx="14" ry="14" width="520" height="62" fill="url(#ptGlass)" stroke="rgba(255,255,255,0.12)" />
      <circle cx="102" cy="101" r="10" fill="rgba(255,255,255,0.22)" />
      <circle cx="132" cy="101" r="10" fill="rgba(255,255,255,0.18)" />
      <circle cx="162" cy="101" r="10" fill="rgba(255,255,255,0.14)" />
      <rect x="210" y="90" rx="10" ry="10" width="330" height="22" fill="rgba(255,255,255,0.12)" />

      <rect x="70" y="154" rx="18" ry="18" width="360" height="300" fill="rgba(3,10,18,0.40)" stroke="rgba(255,255,255,0.10)" />
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 182 + i * 52;
        const accent = i % 2 === 0 ? "rgba(56,189,248,0.95)" : "rgba(165,243,252,0.85)";
        return (
          <g key={i}>
            <rect x="92" y={y} rx="14" ry="14" width="316" height="42" fill="rgba(255,255,255,0.06)" />
            <circle cx="116" cy={y + 21} r="10" fill={accent} />
            <rect x="138" y={y + 12} rx="8" ry="8" width="150" height="16" fill="rgba(255,255,255,0.12)" />
            <rect x="304" y={y + 12} rx="8" ry="8" width="88" height="16" fill="rgba(255,255,255,0.10)" />
          </g>
        );
      })}

      <rect x="452" y="154" rx="18" ry="18" width="436" height="300" fill="rgba(3,10,18,0.40)" stroke="rgba(255,255,255,0.10)" />

      <g transform="translate(630 305)">
        <circle r="84" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="26" />
        <circle r="84" fill="none" stroke="rgba(56,189,248,0.95)" strokeWidth="26" strokeDasharray="260 260" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90)" />
        <circle r="84" fill="none" stroke="rgba(165,243,252,0.85)" strokeWidth="26" strokeDasharray="170 260" strokeDashoffset="-210" strokeLinecap="round" transform="rotate(-90)" />
        <circle r="84" fill="none" stroke="rgba(96,165,250,0.75)" strokeWidth="26" strokeDasharray="95 260" strokeDashoffset="-380" strokeLinecap="round" transform="rotate(-90)" />
        <circle r="54" fill="rgba(0,0,0,0.12)" />
        <text x="0" y="6" textAnchor="middle" fontSize="18" fill="rgba(242,247,255,0.9)" fontWeight="700">Insights</text>
      </g>

      <g transform="translate(760 92)">
        <rect x="-96" y="-30" rx="18" ry="18" width="192" height="60" fill="url(#ptGrad)" opacity="0.95" />
        <text x="0" y="8" textAnchor="middle" fontSize="16" fill="#031018" fontWeight="900">Expense Tracker</text>
      </g>
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="pt-page">
        <div className="pt-shell">
          <div className="pt-left">
            <div className="pt-heroCard">
              <ExpenseTrackerIllustration />
              <div className="pt-heroTitle">Track every expense, clearly.</div>
              {/* Removed the subtitle line as requested */}
            </div>
          </div>

          <div className="pt-right">
            <div className="pt-formWrap">
              <div className="pt-brandTop">
                <h1 className="pt-brandName">PayTrack</h1>
                <div className="pt-welcome">Welcome to PayTrack</div>
              </div>

              <form onSubmit={onSubmit} className="pt-form">
                <label className="pt-field">
                  <span className="pt-label">Email</span>
                  <input
                    className="pt-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="pt-field">
                  <span className="pt-label">Password</span>
                  <input
                    className="pt-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </label>

                {error && <div className="pt-error" role="alert">{error}</div>}

                <div className="pt-actions">
                  <button className="pt-btn" type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Login'}
                  </button>
                  <Link className="pt-link" to="/register">Create account</Link>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const styles = `
/* ===================== PayTrack • Minimal Bluish Split Register ===================== */
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

.pt-heroSub{
  margin: 6px 2px 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
  max-width: 520px;
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
  max-width: 440px;
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
  font-size: 28px;
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

.pt-hint{
  margin-top: 10px;
  text-align:center;
  font-size: 12px;
  color: rgba(242,247,255,.55);
}

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

/* Left illustration stays the same */
function ExpenseTrackerIllustration() {
  return (
    <svg viewBox="0 0 920 520" width="100%" height="auto" role="img" aria-label="PayTrack expense tracker mockup">
      <defs>
        <linearGradient id="bgGlass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <linearGradient id="accentBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(56,189,248,0.95)" />
          <stop offset="1" stopColor="rgba(96,165,250,0.80)" />
        </linearGradient>
        <linearGradient id="accentCyan" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(165,243,252,0.92)" />
          <stop offset="1" stopColor="rgba(56,189,248,0.55)" />
        </linearGradient>
        <filter id="softShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="rgba(0,0,0,0.45)" />
        </filter>
      </defs>

      <rect x="28" y="28" width="864" height="464" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" filter="url(#softShadow)" />

      <g transform="translate(70 70)">
        <rect x="0" y="0" width="520" height="64" rx="18" fill="url(#bgGlass)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="36" cy="32" r="12" fill="rgba(255,255,255,0.20)" />
        <rect x="62" y="22" width="160" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
        <rect x="380" y="18" width="120" height="28" rx="14" fill="url(#accentBlue)" opacity="0.92" />
        <text x="440" y="37" textAnchor="middle" fontSize="14" fill="#02101e" fontWeight="900">PayTrack</text>
      </g>

      {/* Phone */}
      <g transform="translate(94 132)">
        <rect x="0" y="0" width="360" height="342" rx="34" fill="rgba(3,10,18,0.55)" stroke="rgba(255,255,255,0.14)" />
        <rect x="120" y="12" width="120" height="20" rx="10" fill="rgba(255,255,255,0.10)" />

        {/* Balance */}
        <g transform="translate(24 44)">
          <rect x="0" y="0" width="312" height="92" rx="22" fill="url(#accentBlue)" opacity="0.95" />
          <text x="18" y="34" fontSize="12" fill="rgba(2,16,30,0.75)" fontWeight="800">Total Balance</text>
          <text x="18" y="74" fontSize="20" fill="#02101e" fontWeight="900">₹ 12,480</text>
          <rect x="210" y="20" width="86" height="26" rx="13" fill="rgba(255,255,255,0.22)" />
          <text x="253" y="38" textAnchor="middle" fontSize="12" fill="#02101e" fontWeight="900">This week</text>
        </g>

        {/* Categories */}
        <g transform="translate(24 150)">
          <rect x="0" y="0" width="312" height="92" rx="18" fill="rgba(255,255,255,0.06)" />
          <text x="16" y="26" fontSize="12" fill="rgba(242,247,255,0.80)" fontWeight="800">Spending</text>

          {[
            { x: 18, w: 120, c: "rgba(56,189,248,0.95)" },
            { x: 18, w: 170, c: "rgba(165,243,252,0.80)" },
            { x: 18, w: 90,  c: "rgba(96,165,250,0.80)" },
          ].map((bar, i) => (
            <g key={i}>
              <rect x={bar.x} y={38 + i * 18} width="220" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
              <rect x={bar.x} y={38 + i * 18} width={bar.w} height="10" rx="5" fill={bar.c} />
            </g>
          ))}

          <rect x="246" y="36" width="50" height="12" rx="6" fill="rgba(255,255,255,0.10)" />
          <rect x="246" y="54" width="60" height="12" rx="6" fill="rgba(255,255,255,0.10)" />
          <rect x="246" y="72" width="46" height="12" rx="6" fill="rgba(255,255,255,0.10)" />
        </g>

        {/* Transactions */}
        <g transform="translate(24 252)">
          <rect x="0" y="0" width="312" height="70" rx="18" fill="rgba(255,255,255,0.06)" />
          <text x="16" y="26" fontSize="12" fill="rgba(242,247,255,0.80)" fontWeight="800">Recent</text>
          {[
            { y: 34, c: "rgba(56,189,248,0.95)" },
            { y: 52, c: "rgba(165,243,252,0.85)" },
          ].map((t, i) => (
            <g key={i}>
              <circle cx="22" cy={t.y} r="7" fill={t.c} />
              <rect x="36" y={t.y - 6} width="150" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
              <rect x="230" y={t.y - 6} width="64" height="12" rx="6" fill="rgba(255,255,255,0.10)" />
            </g>
          ))}
        </g>
      </g>

      {/* Insights card */}
      <g transform="translate(486 150)">
        <rect x="0" y="0" width="374" height="324" rx="24" fill="rgba(3,10,18,0.40)" stroke="rgba(255,255,255,0.10)" />
        <rect x="22" y="22" width="160" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
        <rect x="22" y="44" width="210" height="10" rx="5" fill="rgba(255,255,255,0.10)" />

        <g transform="translate(22 78)">
          {[
            { y: 0,  w: 210, c: "rgba(56,189,248,0.92)" },
            { y: 34, w: 240, c: "rgba(165,243,252,0.78)" },
            { y: 68, w: 190, c: "rgba(96,165,250,0.78)" },
          ].map((row, i) => (
            <g key={i}>
              <rect x="0" y={row.y} width="260" height="18" rx="9" fill="rgba(255,255,255,0.08)" />
              <rect x="0" y={row.y} width={row.w} height="18" rx="9" fill={row.c} />
            </g>
          ))}
        </g>

        <g transform="translate(22 268)">
          <rect x="0" y="0" width="210" height="38" rx="16" fill="url(#accentCyan)" opacity="0.92" />
          <text x="105" y="24" textAnchor="middle" fontSize="14" fill="#031018" fontWeight="900">
            Track • Budget • Save
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // onSubmit:
  // - prevents page reload
  // - POSTs { name, email, password } to /auth/register
  // - login(token, user) stores auth via AuthContext
  // - redirects to /app/dashboard on success
  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="pt-page">
        <div className="pt-shell">
          {/* LEFT */}
          <div className="pt-left">
            <div className="pt-heroCard">
              <ExpenseTrackerIllustration />
              <div className="pt-heroTitle">Create your PayTrack account.</div>
              <div className="pt-heroSub">
                Start tracking personal expenses with clean insights, budgets, and a smooth dashboard experience.
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="pt-right">
            <div className="pt-formWrap">
              <div className="pt-brandTop">
                <h1 className="pt-brandName">PayTrack</h1>
                <div className="pt-welcome">Welcome to PayTrack</div>
              </div>

              <form onSubmit={onSubmit} className="pt-form">
                <label className="pt-field">
                  <span className="pt-label">Name</span>
                  <input
                    className="pt-input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </label>

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
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </label>

                {error && <div className="pt-error" role="alert">{error}</div>}

                <div className="pt-actions">
                  <button className="pt-btn" type="submit" disabled={loading}>
                    {loading ? 'Creating…' : 'Create account'}
                  </button>
                  <Link className="pt-link" to="/login">Back to login</Link>
                </div>

                <div className="pt-hint">
                  Tip: Use a password you don’t reuse anywhere else.
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

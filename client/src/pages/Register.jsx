import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const styles = `
/* ===================== PayTrack • Bluish Split Register (single file) ===================== */
.pt-page{
  --bg0:#050b14;
  --bg1:#071428;
  --bg2:#0a1f3b;

  --ink:#f2f7ff;
  --muted:rgba(242,247,255,.72);

  --b1:#38bdf8;  /* sky */
  --b2:#60a5fa;  /* blue */
  --b3:#a5f3fc;  /* cyan tint */
  --stroke:rgba(255,255,255,.16);

  --glass:rgba(255,255,255,.09);
  --glass2:rgba(255,255,255,.13);

  --shadow:0 30px 90px rgba(0,0,0,.52);
  --shadow2:0 16px 50px rgba(0,0,0,.40);

  --r:26px;
  --r2:18px;
  --ease:cubic-bezier(.2,.9,.2,1);

  min-height:100vh;
  display:grid;
  place-items:center;
  padding:28px;
  color:var(--ink);
  position:relative;
  overflow:hidden;

  background:
    radial-gradient(1100px 760px at 12% 12%, rgba(56,189,248,.22), transparent 60%),
    radial-gradient(900px 650px at 86% 20%, rgba(96,165,250,.16), transparent 55%),
    radial-gradient(900px 700px at 55% 92%, rgba(165,243,252,.12), transparent 55%),
    linear-gradient(140deg, var(--bg0) 0%, var(--bg1) 55%, #040812 100%);
}

/* subtle dot overlay */
.pt-page::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.10) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity:.18;
  pointer-events:none;
}

/* soft aurora blob */
.pt-page::after{
  content:"";
  position:absolute;
  width: 940px;
  height: 940px;
  left: -280px;
  top: -320px;
  background:
    radial-gradient(circle at 30% 30%, rgba(56,189,248,.55), transparent 60%),
    radial-gradient(circle at 65% 38%, rgba(96,165,250,.30), transparent 62%),
    radial-gradient(circle at 48% 75%, rgba(165,243,252,.24), transparent 62%);
  filter: blur(48px);
  opacity:.42;
  animation: ptFloat 10s var(--ease) infinite;
  pointer-events:none;
}

@keyframes ptFloat{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(26px, 24px) scale(1.03); }
}

.pt-shell{
  width:min(1120px, 96vw);
  min-height: 660px;
  border-radius: var(--r);
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
  overflow:hidden;
  position:relative;
  z-index:1;
  display:grid;
  grid-template-columns: 1.1fr .9fr;
}

/* glow border */
.pt-shell::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius: calc(var(--r) + 2px);
  background: conic-gradient(
    from 90deg,
    rgba(56,189,248,.92),
    rgba(96,165,250,.78),
    rgba(165,243,252,.58),
    rgba(56,189,248,.92)
  );
  filter: blur(14px);
  opacity:.18;
  z-index:0;
}

.pt-left, .pt-right{ position:relative; z-index:1; }

/* LEFT PANEL */
.pt-left{
  padding: 42px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap: 18px;
  border-right: 1px solid rgba(255,255,255,.10);
  background:
    radial-gradient(1000px 620px at 12% 12%, rgba(56,189,248,.18), transparent 60%),
    radial-gradient(900px 520px at 70% 88%, rgba(165,243,252,.10), transparent 55%),
    linear-gradient(135deg, rgba(56,189,248,.08), rgba(96,165,250,.04));
}

.pt-heroCard{
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  box-shadow: var(--shadow2);
  padding: 18px;
  overflow:hidden;
  position:relative;
  transform: translateY(0);
  transition: transform 260ms var(--ease), background 260ms var(--ease);
}

.pt-heroCard::before{
  content:"";
  position:absolute;
  inset:-40%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.20) 35%, transparent 70%);
  transform: translateX(-30%) rotate(10deg);
  opacity: 0;
  transition: opacity 260ms var(--ease), transform 520ms var(--ease);
}

.pt-shell:hover .pt-heroCard{
  transform: translateY(-3px);
  background: rgba(255,255,255,.075);
}
.pt-shell:hover .pt-heroCard::before{
  opacity: 1;
  transform: translateX(30%) rotate(10deg);
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

/* RIGHT PANEL */
.pt-right{
  padding: 42px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:
    radial-gradient(900px 540px at 20% 10%, rgba(165,243,252,.10), transparent 55%),
    radial-gradient(900px 540px at 80% 85%, rgba(56,189,248,.10), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
}

.pt-formWrap{
  width:100%;
  max-width: 440px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow2);
  padding: 22px;
  position:relative;
  overflow:hidden;
}

.pt-formWrap::before{
  content:"";
  position:absolute;
  inset:-40%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.22) 35%, transparent 70%);
  transform: translateX(-30%) rotate(10deg);
  opacity: 0;
  transition: opacity 260ms var(--ease), transform 520ms var(--ease);
}
.pt-formWrap:hover::before{
  opacity: 1;
  transform: translateX(30%) rotate(10deg);
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
  background: linear-gradient(90deg, rgba(165,243,252,1), rgba(96,165,250,1), rgba(56,189,248,1));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(3,10,18,.52);
  color: var(--ink);
  outline:none;
  transition: transform 180ms var(--ease), border-color 180ms var(--ease), box-shadow 180ms var(--ease), background 180ms var(--ease);
}
.pt-input::placeholder{ color: rgba(242,247,255,.42); }
.pt-input:focus{
  border-color: rgba(96,165,250,.78);
  background: rgba(3,10,18,.66);
  box-shadow: 0 0 0 5px rgba(96,165,250,.18);
  transform: translateY(-1px);
}

.pt-error{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(165,243,252,.22);
  background: rgba(165,243,252,.10);
  color: rgba(235,252,255,.92);
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

.pt-link{
  color: rgba(242,247,255,.85);
  text-decoration:none;
  font-weight: 900;
  position:relative;
  padding: 6px 2px;
  transition: transform 160ms var(--ease), color 160ms var(--ease);
}
.pt-link::after{
  content:"";
  position:absolute;
  left:0;
  bottom: 2px;
  width:100%;
  height:2px;
  border-radius:999px;
  background: linear-gradient(90deg, rgba(165,243,252,1), rgba(56,189,248,1));
  transform: scaleX(0);
  transform-origin:left;
  transition: transform 220ms var(--ease);
}
.pt-link:hover{ transform: translateY(-1px); color:#fff; }
.pt-link:hover::after{ transform: scaleX(1); }

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
    border-bottom: 1px solid rgba(255,255,255,.10);
  }
  .pt-right{ padding: 28px; }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce){
  .pt-page::after{ animation:none !important; }
  *{ transition:none !important; animation:none !important; }
}
`;

/* Left “image”: phone-style personal expense tracker mockup (inline SVG) */
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

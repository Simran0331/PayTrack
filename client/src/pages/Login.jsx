import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const styles = `
/* ===================== PayTrack • Bluish Split Login (single file) ===================== */
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
  max-width: 430px;
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
  font-size: 26px;
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

/* Inline illustration stays the same; colors match via current theme already */
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
              <div className="pt-heroSub">
                Recent transactions, categories, and insights—designed for a clean personal expense tracker experience.
              </div>
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

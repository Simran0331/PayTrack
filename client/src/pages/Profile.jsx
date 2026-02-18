import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';


const styles = `
.pt-profile{
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

/* dotted overlay (kept) */
.pt-profile::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity:.16;
  pointer-events:none;
}


   - removed .pt-profile::after (floating glow)
   - removed @keyframes ptFloat
*/

.pt-card{
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border-radius: var(--r);
  border: 1px solid var(--stroke);
  background: var(--glass);
  box-shadow: var(--shadow2);
  padding:18px;
  position:relative;
  overflow:hidden;
  transition: transform 260ms var(--ease), box-shadow 260ms var(--ease), background 260ms var(--ease);
  z-index:1;
}


.pt-card::before{ content:none; }

.pt-card:hover{
  transform: translateY(-3px);
  background: var(--glass2);
  box-shadow: 0 22px 70px rgba(0,0,0,.46);
}

.pt-h3{
  margin:0 0 12px 0;
  font-size:16px;
  letter-spacing:.2px;
}

.pt-row{
  display:flex;
  gap: 12px;
  flex-wrap:wrap;
}
.pt-col{
  flex: 1 1 240px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  padding: 12px;
  transition: transform 220ms var(--ease), background 220ms var(--ease);
}
.pt-col:hover{ transform: translateY(-2px); background: rgba(255,255,255,.08); }

.pt-small{
  font-size:12px;
  color: rgba(242,247,255,.62);
}

.pt-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.08);
  font-weight: 900;
  letter-spacing: .15px;
  margin-top: 8px;
}
.pt-badgeDot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(56,189,248,1), rgba(165,243,252,1));
}

.pt-error{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(248,113,113,.22);
  background: rgba(248,113,113,.10);
  color: rgba(255,230,230,.92);
  font-size: 13px;
}

@media (max-width: 720px){
  .pt-profile{ padding: 16px; }
  .pt-card{ padding: 14px; }
}
`;

export default function Profile() {
  const { user } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        setMe(res.data.user);
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="pt-profile">
        <div className="pt-card">
          <h3 className="pt-h3">Profile</h3>

          {loading ? (
            <div className="pt-small">Loading…</div>
          ) : error ? (
            <div className="pt-error">{error}</div>
          ) : (
            <div>
              <div className="pt-row">
                <div className="pt-col">
                  <div className="pt-small">Name</div>
                  <div className="pt-badge">
                    <span className="pt-badgeDot" />
                    {me?.name || '—'}
                  </div>
                </div>

                <div className="pt-col">
                  <div className="pt-small">Email</div>
                  <div className="pt-badge">
                    <span className="pt-badgeDot" />
                    {me?.email || '—'}
                  </div>
                </div>
              </div>

              <div className="pt-col" style={{ marginTop: 12 }}>
                <div className="pt-small">Account created</div>
                <div className="pt-badge">
                  <span className="pt-badgeDot" />
                  {me?.createdAt ? String(me.createdAt).slice(0, 10) : '—'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

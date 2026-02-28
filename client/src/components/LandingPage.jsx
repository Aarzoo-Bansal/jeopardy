import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBg from './ParticlesBg';

const FEATURES = [
  { icon: '🎯', title: 'Custom Questions', desc: 'Build question sets on any topic — algorithms, history, pop culture, anything.' },
  { icon: '🎡', title: 'Spin Wheel', desc: 'Randomly select teams with an animated spin wheel. Fair and fun.' },
  { icon: '⏱️', title: 'Timed Rounds', desc: 'Circular countdown timer with difficulty-based time limits.' },
  { icon: '👥', title: 'Up to 12 Teams', desc: 'Add teams with emoji avatars. Track scores in real time.' },
  { icon: '🏆', title: 'Live Scoreboard', desc: 'Point-by-point scoring with rank medals and winner celebration.' },
  { icon: '🔒', title: 'Your Data, Private', desc: 'Every question set is yours alone. Multi-tenant by design.' },
];

const DEMO_CATEGORIES = ['Data Structures', 'Algorithms', 'JavaScript', 'Databases', 'Web Dev', 'Bit Magic'];

export default function LandingPage() {
  const navigate = useNavigate();
  const [boardReady, setBoardReady] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setBoardReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    FEATURES.forEach((_, i) => {
      setTimeout(() => setVisibleFeatures(p => [...p, i]), 600 + i * 150);
    });
  }, []);

  const CAT_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
  const DEMO_POINTS = [100, 200, 300, 400, 500];

  return (
    <div style={{ minHeight: '100vh', background: '#080c16', color: '#e2e8f0', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />
      <div className="scanlines" />

      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 32px', maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{
            fontSize: 20, fontWeight: 900, letterSpacing: 2,
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>JEOPARDY</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8,
              padding: '10px 24px', color: '#a78bfa', fontFamily: 'monospace', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 1,
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.background = 'rgba(139,92,246,0.08)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(139,92,246,0.3)'; e.target.style.background = 'transparent'; }}
          >LOG IN</button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', borderRadius: 8,
              padding: '10px 24px', color: '#fff', fontFamily: 'monospace', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: 1,
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >SIGN UP FREE</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '60px 24px 40px', maxWidth: 800, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20, marginBottom: 24,
          background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
          fontSize: 11, color: '#06b6d4', letterSpacing: 3, fontWeight: 700,
        }}>INTERACTIVE QUIZ PLATFORM</div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20,
          background: 'linear-gradient(135deg, #e2e8f0, #06b6d4, #8b5cf6, #ec4899)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease-in-out infinite',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Host Jeopardy Games<br />on Any Topic
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 18px)', color: '#94a3b8', lineHeight: 1.7,
          maxWidth: 560, margin: '0 auto 36px',
        }}>
          Build custom question sets, spin the wheel, track scores — perfect for classrooms, team building, and trivia nights.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', borderRadius: 10,
              padding: '14px 36px', color: '#fff', fontFamily: 'monospace', fontWeight: 800,
              fontSize: 15, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: 1,
              boxShadow: '0 4px 24px rgba(6,182,212,0.25)',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(6,182,212,0.35)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(6,182,212,0.25)'; }}
          >GET STARTED — IT'S FREE</button>
        </div>
      </section>

      {/* Mini Game Board Preview */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 960, margin: '20px auto 60px',
        padding: '0 24px',
      }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.6), rgba(30,41,59,0.4))',
          border: '1px solid rgba(139,92,246,0.15)', borderRadius: 16,
          padding: 16, backdropFilter: 'blur(10px)', overflowX: 'auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${DEMO_CATEGORIES.length}, minmax(90px, 1fr))`,
            gap: 8,
          }}>
            {/* Headers */}
            {DEMO_CATEGORIES.map((cat, ci) => (
              <div key={cat} style={{
                background: `linear-gradient(135deg, ${CAT_COLORS[ci]}22, ${CAT_COLORS[ci]}08)`,
                border: `1px solid ${CAT_COLORS[ci]}44`, borderRadius: 8,
                padding: '8px 6px', textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: boardReady ? `cellAppear 0.4s ease-out ${ci * 0.06}s both` : 'none',
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: CAT_COLORS[ci], letterSpacing: 0.5 }}>
                  {cat.toUpperCase()}
                </span>
              </div>
            ))}
            {/* Cells */}
            {DEMO_POINTS.map((pts, ri) =>
              DEMO_CATEGORIES.map((cat, ci) => {
                const key = `${ci}-${ri}`;
                const cc = CAT_COLORS[ci];
                const isHovered = hoveredCell === key;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      padding: '14px 0', borderRadius: 8, textAlign: 'center',
                      fontSize: 16, fontWeight: 900, fontFamily: 'monospace', color: cc,
                      border: `1px solid ${cc}55`,
                      background: isHovered
                        ? `linear-gradient(135deg, ${cc}28, ${cc}14)`
                        : `linear-gradient(135deg, ${cc}18, ${cc}08)`,
                      boxShadow: isHovered
                        ? `0 0 20px ${cc}22, inset 0 0 20px ${cc}12`
                        : `inset 0 0 20px ${cc}08`,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      cursor: 'default',
                      animation: boardReady ? `cellAppear 0.4s ease-out ${(ci * 5 + ri) * 0.04 + 0.3}s both` : 'none',
                    }}
                  >${pts}</div>
                );
              })
            )}
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#475569', marginTop: 12, letterSpacing: 2 }}>
          PREVIEW — YOUR BOARD, YOUR QUESTIONS
        </p>
      </section>

      {/* Features */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: 28, fontWeight: 900, marginBottom: 40,
          background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Everything You Need</h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.8), rgba(30,41,59,0.4))',
              border: '1px solid rgba(6,182,212,0.1)', borderRadius: 14,
              padding: '24px 20px',
              opacity: visibleFeatures.includes(i) ? 1 : 0,
              transform: visibleFeatures.includes(i) ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.5s ease',
            }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{f.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '60px 24px 80px',
        background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.03), rgba(139,92,246,0.03))',
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginBottom: 16,
          background: 'linear-gradient(135deg, #e2e8f0, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Ready to Host?</h2>
        <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
          Create your first game in under 2 minutes. Free forever.
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', borderRadius: 10,
            padding: '14px 40px', color: '#fff', fontFamily: 'monospace', fontWeight: 800,
            fontSize: 15, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: 1,
            boxShadow: '0 4px 24px rgba(6,182,212,0.25)',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(6,182,212,0.35)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(6,182,212,0.25)'; }}
        >CREATE YOUR GAME</button>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '24px', borderTop: '1px solid rgba(6,182,212,0.08)',
      }}>
        <p style={{ fontSize: 11, color: '#334155' }}>
          Built by Aarzoo Bansal · Northeastern University
        </p>
      </footer>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
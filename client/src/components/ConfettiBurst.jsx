// CONFETTI BURST
import { useMemo } from 'react';

export default function ConfettiBurst({ active }) {
  const pieces = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i, x: 50 + (Math.random() - 0.5) * 10,
      angle: Math.random() * 360, dist: Math.random() * 45 + 20,
      color: ["#06b6d4","#8b5cf6","#ec4899","#f59e0b","#10b981","#fbbf24"][Math.floor(Math.random()*6)],
      size: Math.random() * 8 + 4, dur: Math.random() * 1.5 + 1, rot: Math.random() * 720 - 360,
    }))
  , []);
  if (!active) return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,overflow:"hidden"}}>
      {pieces.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist + "vw";
        const ty = Math.sin(rad) * p.dist * -1 + "vh";
        return (
          <div key={p.id} style={{
            position:"absolute", left: p.x + "%", top:"50%",
            width: p.size, height: p.size * 0.6, background: p.color, borderRadius: 2,
            animation: "confettiFly " + p.dur + "s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
            "--tx": tx, "--ty": ty, "--rot": p.rot + "deg",
          }}/>
        );
      })}
    </div>
  );
}
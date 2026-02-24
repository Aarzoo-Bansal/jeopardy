// SCORE POP
export default function ScorePop({ value }) {
  if (!value) return null;
  return (
    <div style={{
      position:"absolute",top:-10,right:10,fontSize:18,fontWeight:800,fontFamily:"monospace",
      color: value > 0 ? "#10b981" : "#ef4444",
      animation:"scorePop 0.8s ease-out forwards",pointerEvents:"none",zIndex:20,
    }}>{value > 0 ? "+" + value : value}</div>
  );
}
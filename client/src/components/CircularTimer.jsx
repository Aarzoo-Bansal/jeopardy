// CIRCULAR SVG TIMER
export default function CircularTimer({ timeLeft, totalTime, running }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circumference * (1 - progress);
  const danger = timeLeft <= 5 && timeLeft > 0;
  return (
    <div style={{position:"relative",width:150,height:150,margin:"0 auto"}}>
      <svg viewBox="0 0 140 140" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1f2937" strokeWidth="8"/>
        <circle cx="70" cy="70" r={radius} fill="none"
          stroke={danger ? "#ef4444" : "url(#timerGrad)"}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{transition: running ? "stroke-dashoffset 1s linear" : "none"}}
        />
        {danger && <circle cx="70" cy="70" r={radius + 6} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" style={{animation:"dangerPulse 0.5s ease-in-out infinite"}} />}
        <defs><linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <span style={{fontSize:42,fontWeight:800,fontFamily:"monospace",color:danger?"#ef4444":"#e2e8f0",animation:danger?"dangerPulse 0.5s ease-in-out infinite":"none"}}>{timeLeft}</span>
        <span style={{fontSize:10,color:"#64748b",fontFamily:"monospace",letterSpacing:2}}>SECONDS</span>
      </div>
    </div>
  );
}
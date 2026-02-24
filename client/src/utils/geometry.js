export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function describeArc(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, endAngle);
  const e = polarToCartesian(cx, cy, r, startAngle);
  return "M " + cx + " " + cy + " L " + s.x + " " + s.y + " A " + r + " " + r + " 0 " + (endAngle - startAngle > 180 ? 1 : 0) + " 0 " + e.x + " " + e.y + " Z";
}
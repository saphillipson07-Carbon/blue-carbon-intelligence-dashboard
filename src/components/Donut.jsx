export default function Donut({ pct, centerNum, centerLabel, color, size = 104 }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct / 100);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E9EEF0" strokeWidth="14" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="47" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0B3150" fontFamily="'Playfair Display', Georgia, serif">
        {centerNum}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="7.5" fill="#6E7F8A" fontFamily="'DM Sans', sans-serif">
        {centerLabel}
      </text>
    </svg>
  );
}

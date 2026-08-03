const BAR_HEIGHTS = [38, 52, 62, 78, 94, 68];
const BAR_COLORS = ['#93c5fd', '#7dd3ae', '#6ee0a6', '#5eea9c', '#4ade80', '#34d399'];

export function PolicyTrendChart() {
  return (
    <div className="flex items-end gap-2 h-24">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{ height: `${h}%`, background: BAR_COLORS[i] }}
        />
      ))}
    </div>
  );
}

export function IncidentRateChart() {
  return (
    <svg viewBox="0 0 200 96" className="w-full h-24" fill="none">
      <path
        d="M0 65 C 30 25, 60 25, 90 50 S 150 85, 200 35"
        stroke="#7c3aed"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

const COLORS = [
  'bg-brand-100 text-brand-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
];

function colorFor(name) {
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
}

export default function Avatar({ name, size = 8 }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold ${colorFor(
        name
      )}`}
      style={{ width: size * 4, height: size * 4, fontSize: size * 1.5 }}
    >
      {initials}
    </div>
  );
}

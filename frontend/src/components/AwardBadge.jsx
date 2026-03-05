// src/components/AwardBadge.jsx
const COLORS = {
  Emmy:          'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  Oscar:         'bg-amber-500/20  text-amber-300  border-amber-500/40',
  'Golden Globe':'bg-blue-500/20   text-blue-300   border-blue-400/40',
  SAG:           'bg-purple-500/20 text-purple-300 border-purple-400/40',
  BAFTA:         'bg-green-500/20  text-green-300  border-green-400/40',
};
const ICONS = { Emmy: '📺', Oscar: '🏆', 'Golden Globe': '🌐', SAG: '🎭', BAFTA: '🎬' };

export default function AwardBadge({ type, status, small = false }) {
  const c = COLORS[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  const sz = small ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-medium backdrop-blur-sm ${c} ${sz}`}>
      {ICONS[type]} {type}{status === 'Won' && ' ✓'}
    </span>
  );
}

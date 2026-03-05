// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sz = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-14 h-14' }[size];
  const spinner = <div className={`${sz} border-4 border-accent-red border-t-transparent rounded-full animate-spin`} />;
  if (fullPage) return <div className="min-h-screen bg-cinema-bg flex items-center justify-center">{spinner}</div>;
  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}

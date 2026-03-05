// src/components/SearchBar.jsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-cinema-card border border-cinema-border rounded-lg text-cinema-text text-sm placeholder:text-cinema-muted focus:outline-none focus:border-accent-red transition-colors"
      />
    </div>
  );
}

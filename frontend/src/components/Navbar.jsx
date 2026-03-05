// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FilmIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/',        label: 'Home'         },
  { to: '/movies',  label: 'Movies'       },
  { to: '/atlanta', label: '📍 ATL Hub'   },
  { to: '/watchlist', label: 'Watchlist', auth: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname }     = useLocation();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); setOpen(false); };

  return (
    <nav className="sticky top-0 z-50 bg-cinema-bg/95 backdrop-blur border-b border-cinema-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
       </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <FilmIcon className="w-6 h-6 text-accent-red" />
          <span>CineTrack <span className="text-accent-red">ATL</span></span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.filter(l => !l.auth || user).map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${pathname === to ? 'text-white font-medium' : 'text-cinema-muted hover:text-white'}`}>
              {label}
            </Link>
          ))}
        </div>

       {/* Auth */}
<div className="hidden md:flex items-center gap-3">
  {user ? (
    <>
      <span className="text-sm text-cinema-muted">
        Hi, {user?.name?.split(' ')?.[0] ?? ''}
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-cinema-muted hover:text-white"
      >
        Log out
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="text-sm text-cinema-muted hover:text-white">
        Log in
      </Link>
      <Link
        to="/register"
        className="text-sm bg-accent-red text-white px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
      >
        Sign up
      </Link>
    </>
  )}
</div>


      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cinema-card border-t border-cinema-border px-4 py-3 space-y-1">
          {NAV.filter(l => !l.auth || user).map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-cinema-text hover:text-white rounded hover:bg-cinema-card2">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-cinema-border flex flex-col gap-2">
            {user ? (
              <button onClick={handleLogout} className="text-left px-3 py-2 text-sm text-cinema-muted">Log out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-cinema-text">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-2 text-sm bg-accent-red text-white rounded text-center">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

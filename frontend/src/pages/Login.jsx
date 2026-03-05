// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FilmIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login }       = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-cinema-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-cinema-card border border-cinema-border rounded-2xl p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <FilmIcon className="w-7 h-7 text-accent-red" />
          <span className="text-xl font-bold text-white">CineTrack <span className="text-accent-red">ATL</span></span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Sign in</h1>
        <p className="text-cinema-muted text-sm mb-7 text-center">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required placeholder="Email"
            value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            className="w-full bg-cinema-card2 border border-cinema-border rounded-lg px-4 py-3 text-cinema-text text-sm placeholder:text-cinema-muted focus:outline-none focus:border-accent-red transition-colors" />
          <input type="password" required placeholder="Password"
            value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            className="w-full bg-cinema-card2 border border-cinema-border rounded-lg px-4 py-3 text-cinema-text text-sm placeholder:text-cinema-muted focus:outline-none focus:border-accent-red transition-colors" />
          <button type="submit" disabled={busy}
            className="w-full bg-accent-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
            {busy ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-cinema-muted mt-6">
          New here? <Link to="/register" className="text-accent-red hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}

// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FilmIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register }    = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setBusy(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created!');
      navigate('/');
    } catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  const inp = "w-full bg-cinema-card2 border border-cinema-border rounded-lg px-4 py-3 text-cinema-text text-sm placeholder:text-cinema-muted focus:outline-none focus:border-accent-red transition-colors";

  return (
    <div className="min-h-screen bg-cinema-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-cinema-card border border-cinema-border rounded-2xl p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <FilmIcon className="w-7 h-7 text-accent-red" />
          <span className="text-xl font-bold text-white">CineTrack <span className="text-accent-red">ATL</span></span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Create account</h1>
        <p className="text-cinema-muted text-sm mb-7 text-center">Join CineTrack ATL</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Full name"
            value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className={inp} />
          <input type="email" required placeholder="Email"
            value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inp} />
          <input type="password" required placeholder="Password (min 6 chars)"
            value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className={inp} />
          {/* Account type — filmmakers can post job listings */}
          <div className="space-y-2">
            <p className="text-xs text-cinema-muted">Account type</p>
            <div className="grid grid-cols-2 gap-2">
              {[['user','🎬 Movie Fan'],['filmmaker','🎭 Filmmaker']].map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setForm(f => ({...f, role: val}))}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    form.role === val
                      ? 'bg-accent-red text-white border-accent-red'
                      : 'bg-cinema-card2 text-cinema-muted border-cinema-border hover:border-cinema-text'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {form.role === 'filmmaker' && (
              <p className="text-xs text-accent-green">✓ Filmmakers can post job listings and open calls</p>
            )}
          </div>
          <button type="submit" disabled={busy}
            className="w-full bg-accent-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
            {busy ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-cinema-muted mt-6">
          Already have an account? <Link to="/login" className="text-accent-red hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

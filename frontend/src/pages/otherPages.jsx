// ═══════════════════════════════════════════════════════════════════
// src/pages/Login.jsx
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login }       = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome back to CineTrack ATL</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" required placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#e50914]"
          />
          <input
            type="password" required placeholder="Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#e50914]"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#e50914] text-white py-3 rounded-lg font-semibold hover:bg-[#c40812] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New here? <Link to="/register" className="text-[#e50914] hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// src/pages/Register.jsx
// ═══════════════════════════════════════════════════════════════════
import { useState as useStateR } from 'react';
import { useNavigate as useNavR, Link as LinkR } from 'react-router-dom';
import { useAuth as useAuthR } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Register() {
  const { register } = useAuthR();
  const navigate     = useNavR();
  const [form, setForm] = useStateR({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useStateR(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Join CineTrack ATL</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Full name"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#e50914]"
          />
          <input type="email" required placeholder="Email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#e50914]"
          />
          <input type="password" required placeholder="Password (min 6 chars)"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#e50914]"
          />
          {/* Account type — filmmakers get job posting rights */}
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-[#e50914]"
          >
            <option value="user">Movie Fan</option>
            <option value="filmmaker">Filmmaker / Industry Pro</option>
          </select>
          <button type="submit" disabled={loading}
            className="w-full bg-[#e50914] text-white py-3 rounded-lg font-semibold hover:bg-[#c40812] transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <LinkR to="/login" className="text-[#e50914] hover:underline">Sign in</LinkR>
        </p>
      </div>
    </div>
  );
}
export default Register;


// ═══════════════════════════════════════════════════════════════════
// src/pages/Watchlist.jsx
// ═══════════════════════════════════════════════════════════════════
import { useState as useStateWL, useEffect as useEffectWL } from 'react';
import MovieCard from '../components/MovieCard';
import { getWatchlist } from '../services/allServices';

export function Watchlist() {
  const [list,    setList]    = useStateWL([]);
  const [loading, setLoading] = useStateWL(true);

  useEffectWL(() => {
    getWatchlist()
      .then(setList)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (movieId) => setList(l => l.filter(m => m.movieId !== movieId));

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">My Watchlist</h1>
      {list.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-5xl mb-4">🎬</p>
          <p>No movies saved yet. Browse and click the bookmark icon to save.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {list.map(item => (
            <MovieCard
              key={item.movieId}
              movie={{ id: item.movieId, title: item.title, poster_path: item.poster, vote_average: item.rating }}
              inWatchlist
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export { Watchlist as default };

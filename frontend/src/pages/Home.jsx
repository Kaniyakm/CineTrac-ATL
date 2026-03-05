// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard      from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTrending }    from '../services/movieAPI';
import { getFeatured }    from '../services/productionAPI';
import { tmdbImg }        from '../services/movieAPI';

export default function Home() {
  const [trending,  setTrending]  = useState([]);
  const [featured,  setFeatured]  = useState([]);
  const [hero,      setHero]      = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getTrending().then(data => { setTrending(data); setHero(data[0]); }),
      getFeatured().then(setFeatured),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const backdropUrl = hero?.backdrop_path ? tmdbImg(hero.backdrop_path, 'w1280') : null;

  return (
    <div className="min-h-screen bg-cinema-bg">

      {/* ── Hero Banner ── */}
      {hero && (
        <div className="relative h-[58vh] md:h-[68vh] overflow-hidden">
          {backdropUrl && <img src={backdropUrl} alt={hero.title} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{hero.title}</motion.h1>
            <p className="text-cinema-text text-sm mb-5 line-clamp-3 drop-shadow">{hero.overview}</p>
            <div className="flex gap-3">
              <Link to={`/movies/${hero.id}`}
                className="bg-white text-black px-6 py-2.5 rounded font-semibold text-sm hover:bg-gray-200 transition-colors">
                ▶ More Info
              </Link>
              <Link to="/atlanta"
                className="bg-accent-red/80 text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-accent-red transition-colors">
                📍 ATL Films
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Trending Now ── */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-5">🔥 Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.slice(0, 12).map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
        <div className="mt-6 text-center">
          <Link to="/movies" className="inline-block border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-text px-6 py-2 rounded text-sm transition-colors">
            Browse All Movies →
          </Link>
        </div>
      </section>

      {/* ── ATL Award Productions ── */}
      {featured.length > 0 && (
        <section className="px-6 py-10 max-w-7xl mx-auto border-t border-cinema-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">🏆 Emmy & Oscar — Filmed in Atlanta</h2>
            <Link to="/atlanta" className="text-sm text-accent-red hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.map(prod => {
              const poster = prod.poster ? tmdbImg(prod.poster, 'w342') : null;
              const wins   = (prod.awards || []).filter(a => a.status === 'Won').length;
              return (
                <Link key={prod._id} to="/atlanta" className="group">
                  <div className="relative aspect-[2/3] bg-cinema-card rounded-lg overflow-hidden">
                    {poster
                      ? <img src={poster} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                    }
                    {wins > 0 && (
                      <div className="absolute top-2 left-2 bg-accent-gold text-black text-xs font-bold px-1.5 py-0.5 rounded">
                        {wins}× WON
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-cinema-text truncate">{prod.title}</p>
                  <p className="text-xs text-cinema-muted">{prod.type} · {prod.years}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Jobs CTA ── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-950/60 to-cinema-card border border-accent-red/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Work in the Atlanta Film Industry</h3>
            <p className="text-cinema-muted text-sm">Open calls, acting roles, crew positions, and internships — updated weekly.</p>
          </div>
          <Link to="/atlanta" className="flex-shrink-0 bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Browse Jobs & Open Calls
          </Link>
        </div>
      </section>

    </div>
  );
}

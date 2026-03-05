// src/pages/Watchlist.jsx
import { useState, useEffect } from 'react';
import { Link }      from 'react-router-dom';
import MovieCard     from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getWatchlist } from '../services/watchlistAPI';

export default function Watchlist() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlist().then(setList).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRemove = (movieId) => setList(l => l.filter(m => m.movieId !== movieId));

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-cinema-bg px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">My Watchlist</h1>
      <p className="text-cinema-muted text-sm mb-8">{list.length} saved movie{list.length !== 1 ? 's' : ''}</p>

      {list.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-cinema-muted mb-4">Nothing saved yet.</p>
          <Link to="/movies" className="text-accent-red hover:underline text-sm">Browse movies →</Link>
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

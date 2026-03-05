// src/components/MovieCard.jsx
import { useState } from 'react';
import { Link }     from 'react-router-dom';
import { motion }   from 'framer-motion';
import { StarIcon, BookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { useAuth }         from '../context/AuthContext';
import { addToWatchlist, removeWatchlist } from '../services/watchlistAPI';
import { tmdbImg }         from '../services/movieAPI';
import toast from 'react-hot-toast';

export default function MovieCard({ movie, inWatchlist: initInWL = false, onRemove }) {
  const { user }        = useAuth();
  const [inWL, setInWL] = useState(initInWL);
  const [busy, setBusy] = useState(false);

  const poster = tmdbImg(movie.poster_path, 'w342');

  const toggleWL = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to save movies'); return; }
    setBusy(true);
    try {
      if (inWL) {
        await removeWatchlist(movie.id);
        setInWL(false); onRemove?.(movie.id);
        toast.success('Removed from watchlist');
      } else {
        await addToWatchlist({ movieId: movie.id, title: movie.title, poster: movie.poster_path, rating: movie.vote_average });
        setInWL(true); toast.success('Saved to watchlist');
      }
    } catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="relative group">
      <Link to={`/movies/${movie.id}`}>
        <div className="relative aspect-[2/3] bg-cinema-card rounded-lg overflow-hidden">
          <img src={poster} alt={movie.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = 'https://via.placeholder.com/342x513/1c1c1c/888?text=No+Image'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5 backdrop-blur-sm">
              <StarIcon className="w-3 h-3 text-accent-gold" />
              <span className="text-xs text-white font-medium">{movie.vote_average?.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-cinema-text truncate">{movie.title}</h3>
          <p className="text-xs text-cinema-muted">{movie.release_date?.substring(0, 4) || ''}</p>
        </div>
      </Link>
      <button onClick={toggleWL} disabled={busy} title={inWL ? 'Remove' : 'Save'}
        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors">
        {inWL ? <BookmarkIcon className="w-4 h-4 text-accent-red" /> : <BookmarkOutline className="w-4 h-4 text-white" />}
      </button>
    </motion.div>
  );
}

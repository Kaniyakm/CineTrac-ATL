// src/pages/MovieDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link }  from 'react-router-dom';
import { motion }           from 'framer-motion';
import ReactPlayer          from 'react-player/youtube';
import { StarIcon, BookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline, ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth }    from '../context/AuthContext';
import { getMovieById, tmdbImg } from '../services/movieAPI';
import { getReviews, postReview, deleteReview } from '../services/watchlistAPI';
import { addToWatchlist, removeWatchlist, getWatchlist } from '../services/watchlistAPI';
import toast from 'react-hot-toast';

export default function MovieDetails() {
  const { id }          = useParams();
  const { user }        = useAuth();
  const [movie,   setMovie]   = useState(null);
  const [reviews, setReviews] = useState([]);
  const [inWL,    setInWL]    = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviewForm, setReviewForm]   = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMovieById(id).then(setMovie),
      getReviews(id).then(setReviews).catch(() => {}),
      user ? getWatchlist().then(list => setInWL(list.some(w => w.movieId === +id))).catch(() => {}) : Promise.resolve(),
    ]).finally(() => setLoading(false));
  }, [id, user]);

  const toggleWL = async () => {
    if (!user) { toast.error('Log in to save movies'); return; }
    try {
      if (inWL) { await removeWatchlist(id); setInWL(false); toast.success('Removed from watchlist'); }
      else      { await addToWatchlist({ movieId: +id, title: movie.title, poster: movie.poster_path, rating: movie.vote_average }); setInWL(true); toast.success('Saved!'); }
    } catch (err) { toast.error(err.message); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to review'); return; }
    setSubmitting(true);
    try {
      const r = await postReview(id, { ...reviewForm, movieTitle: movie.title });
      setReviews(prev => [r, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review posted!');
    } catch (err) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!movie)  return <div className="min-h-screen bg-cinema-bg flex items-center justify-center text-cinema-muted">Movie not found</div>;

  const backdrop = movie.backdrop_path ? tmdbImg(movie.backdrop_path, 'w1280') : null;
  const poster   = movie.poster_path   ? tmdbImg(movie.poster_path, 'w500')   : null;
  const trailer  = movie.trailers?.[0];

  return (
    <div className="min-h-screen bg-cinema-bg">
      {/* Backdrop */}
      {backdrop && (
        <div className="relative h-[45vh] overflow-hidden">
          <img src={backdrop} alt={movie.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg to-transparent" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 -mt-32 relative">
        <Link to="/movies" className="inline-flex items-center gap-2 text-cinema-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Movies
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {poster && (
            <div className="flex-shrink-0">
              <img src={poster} alt={movie.title} className="w-48 md:w-64 rounded-xl shadow-2xl" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {movie.release_date && <span className="text-cinema-muted text-sm">{movie.release_date.substring(0,4)}</span>}
              {movie.runtime > 0  && <span className="text-cinema-muted text-sm">{movie.runtime}m</span>}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 bg-cinema-card px-2 py-0.5 rounded text-sm">
                  <StarIcon className="w-3.5 h-3.5 text-accent-gold" />
                  <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map(g => (
                <span key={g.id} className="bg-cinema-card border border-cinema-border text-cinema-muted text-xs px-2 py-1 rounded-full">{g.name}</span>
              ))}
            </div>
            <p className="text-cinema-text leading-relaxed mb-6">{movie.overview}</p>

            <div className="flex gap-3 flex-wrap">
              {trailer && (
                <button onClick={() => setShowTrailer(!showTrailer)}
                  className="bg-accent-red text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
                  ▶ {showTrailer ? 'Hide' : 'Watch'} Trailer
                </button>
              )}
              <button onClick={toggleWL}
                className="flex items-center gap-2 border border-cinema-border text-cinema-muted px-5 py-2 rounded-lg text-sm hover:text-white hover:border-cinema-text transition-colors">
                {inWL ? <BookmarkIcon className="w-4 h-4 text-accent-red" /> : <BookmarkOutline className="w-4 h-4" />}
                {inWL ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {showTrailer && trailer && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="mt-8 rounded-xl overflow-hidden">
            <ReactPlayer url={`https://www.youtube.com/watch?v=${trailer.key}`} width="100%" height="400px" controls />
          </motion.div>
        )}

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {movie.cast.map(c => (
                <div key={c.id} className="flex-shrink-0 w-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-cinema-card overflow-hidden mb-2">
                    {c.profile_path
                      ? <img src={tmdbImg(c.profile_path, 'w185')} alt={c.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    }
                  </div>
                  <p className="text-xs text-cinema-text truncate">{c.name}</p>
                  <p className="text-xs text-cinema-muted truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-white mb-5">Reviews</h2>

          {/* Write review */}
          {user && (
            <form onSubmit={submitReview} className="bg-cinema-card border border-cinema-border rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm text-cinema-muted">Rating:</label>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewForm(f => ({...f, rating: n}))}>
                    <StarIcon className={`w-5 h-5 ${n <= reviewForm.rating ? 'text-accent-gold' : 'text-cinema-border'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                placeholder="Write your review..."
                rows={3}
                required
                className="w-full bg-cinema-card2 border border-cinema-border rounded-lg px-4 py-2 text-cinema-text text-sm placeholder:text-cinema-muted focus:outline-none focus:border-accent-red resize-none mb-3"
              />
              <button type="submit" disabled={submitting}
                className="bg-accent-red text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                {submitting ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-cinema-muted text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r._id} className="bg-cinema-card border border-cinema-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-red flex items-center justify-center text-white font-bold text-sm">
                        {r.userId?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-white">{r.userId?.name || 'User'}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(n => <StarIcon key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'text-accent-gold' : 'text-cinema-border'}`} />)}
                      </div>
                    </div>
                    {user?._id === r.userId?._id && (
                      <button onClick={() => handleDeleteReview(r._id)} className="text-xs text-cinema-muted hover:text-accent-red transition-colors">Delete</button>
                    )}
                  </div>
                  <p className="text-cinema-text text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

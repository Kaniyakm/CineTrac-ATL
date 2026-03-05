// src/pages/Movies.jsx
import { useState, useEffect } from 'react';
import MovieCard      from '../components/MovieCard';
import SearchBar      from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import useDebounce    from '../hooks/useDebounce';
import { getPopular, getTrending,  searchMovies, getGenres } from '../services/movieAPI';



export default function Movies() {
  const [movies,  setMovies]  = useState([]);
  const [genres,  setGenres]  = useState([]);
  const [query,   setQuery]   = useState('');
  const [genre,   setGenre]   = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(1);
  const [loading, setLoading] = useState(true);
  const dq = useDebounce(query);

  useEffect(() => { getGenres().then(setGenres).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    (dq ? searchMovies(dq, page) : getPopular(page))
      .then(data => { setMovies(data.results || []); setTotal(data.total_pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dq, page, genre]);

useEffect(() => {
  getTrending().then(res => setMovies(res.data));
}, []);


  const handleQuery = v => { setQuery(v); setPage(1); };

  return (
    <div className="min-h-screen bg-cinema-bg px-6 py-10 max-w-7xl mx-auto">

      {/* Filters */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <SearchBar value={query} onChange={handleQuery} placeholder="Search movies..." className="flex-1 min-w-[200px]" />
        <select value={genre} onChange={e => { setGenre(e.target.value); setPage(1); }}
          className="bg-cinema-card border border-cinema-border rounded-lg text-cinema-muted text-sm px-3 py-2.5 focus:outline-none focus:border-accent-red">
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-cinema-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 text-cinema-muted">
          <p className="text-5xl mb-4">🔍</p>
          <p>No results for "{query}"</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {movies.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-cinema-card text-cinema-muted rounded disabled:opacity-30 hover:bg-cinema-border text-sm transition-colors">
              ← Prev
            </button>
            <span className="text-cinema-muted text-sm">Page {page} of {Math.min(total, 500)}</span>
            <button disabled={page >= total} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-cinema-card text-cinema-muted rounded disabled:opacity-30 hover:bg-cinema-border text-sm transition-colors">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

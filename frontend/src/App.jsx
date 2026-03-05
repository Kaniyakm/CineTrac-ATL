// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import Movies       from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Watchlist    from './pages/Watchlist';
import Login        from './pages/Login';
import Register     from './pages/Register';
import AtlantaFilm from './pages/AtlantaFilm.jsx';



const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-cinema-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-cinema-bg">
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/movies"     element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/atlanta"    element={<AtlantaFilm />} />
        <Route path="/watchlist"  element={<Protected><Watchlist /></Protected>} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1c1c1c', color: '#fff', border: '1px solid #2a2a2a' } }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

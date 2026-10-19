import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import './App.css';

const FAVORITES_STORAGE_KEY = 'cineverse_favorites';
const SETTINGS_STORAGE_KEY = 'cineverse_settings';

const DEFAULT_SETTINGS = {
  apiKey: 'trilogy',
  defaultType: '',
  plotLength: 'full',
  gridLayout: 'comfortable',
  theme: 'light',
  autoSearch: false,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'details' | 'favorites' | 'settings'
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Initialize settings from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Failed to load settings from localStorage:', e);
      return DEFAULT_SETTINGS;
    }
  });

  // Persist settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

  // Initialize favorites from localStorage with error safety
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e);
      return [];
    }
  });

  // Persist favorites whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Navigate to Movie Details
  const handleSelectMovie = (imdbID) => {
    setSelectedMovieId(imdbID);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch between Home, Favorites, Details, or Settings
  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'details') {
      setSelectedMovieId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite (Add or Remove)
  const handleToggleFavorite = (movie) => {
    if (!movie || !movie.imdbID) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter((item) => item.imdbID !== movie.imdbID);
      } else {
        // Save essential movie fields
        const movieToSave = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Type: movie.Type || 'movie',
          imdbRating: movie.imdbRating,
          Genre: movie.Genre
        };
        return [...prev, movieToSave];
      }
    });
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all saved favorites?')) {
      setFavorites([]);
    }
  };

  const handleImportFavorites = (importedList) => {
    setFavorites((prev) => {
      const existingIds = new Set(prev.map(m => m.imdbID));
      const newItems = importedList.filter(m => !existingIds.has(m.imdbID));
      return [...prev, ...newItems];
    });
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
        isDark={isDark}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home
            onSelectMovie={handleSelectMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            settings={settings}
          />
        )}

        {currentPage === 'details' && (
          <MovieDetails
            movieId={selectedMovieId}
            onBack={() => handleNavigate('home')}
            isFavorite={favorites.some((f) => f.imdbID === selectedMovieId)}
            onToggleFavorite={handleToggleFavorite}
            settings={settings}
          />
        )}

        {currentPage === 'favorites' && (
          <Favorites
            favorites={favorites}
            onSelectMovie={handleSelectMovie}
            onToggleFavorite={handleToggleFavorite}
            onClearAll={handleClearAllFavorites}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'settings' && (
          <Settings
            settings={settings}
            onSaveSettings={handleSaveSettings}
            favorites={favorites}
            onImportFavorites={handleImportFavorites}
            onClearFavorites={handleClearAllFavorites}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors ${
        isDark 
          ? 'border-slate-800 bg-slate-950/70 text-slate-400' 
          : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CineVerse — Built with React & Vite for Internship Project</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('settings')}
              className={`hover:underline cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Settings
            </button>
            <span>•</span>
            <p className="flex items-center gap-1.5">
              Powered by <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>OMDb API</span> & <span className="font-semibold text-rose-500">localStorage</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

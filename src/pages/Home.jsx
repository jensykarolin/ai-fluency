import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { searchMovies, getInitialFeaturedMovies } from '../services/movieService';
import { Clapperboard, Loader2, AlertCircle, Sparkles, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

/**
 * Home page in a bright light design with settings integration.
 */
export default function Home({ onSelectMovie, favorites, onToggleFavorite, settings }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedType, setSelectedType] = useState(settings?.defaultType || '');

  // Keep type aligned if settings change
  useEffect(() => {
    if (settings?.defaultType !== undefined) {
      setSelectedType(settings.defaultType);
    }
  }, [settings?.defaultType]);

  // Load initial featured movies on mount
  useEffect(() => {
    const initial = getInitialFeaturedMovies();
    setMovies(initial);
    setTotalResults(initial.length);
  }, []);

  const handleSearch = async (query, page = 1, typeOverride = null) => {
    setSearchQuery(query);
    setCurrentPage(page);
    setLoading(true);
    setErrorMessage('');

    const activeType = typeOverride !== null ? typeOverride : selectedType;

    try {
      const result = await searchMovies(query, page, {
        type: activeType,
        apiKey: settings?.apiKey
      });

      if (result.error) {
        setMovies([]);
        setTotalResults(0);
        setErrorMessage(result.error);
      } else {
        setMovies(result.movies || []);
        setTotalResults(result.totalResults || 0);
      }
    } catch (err) {
      setErrorMessage('Failed to search movies. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    if (searchQuery.trim()) {
      handleSearch(searchQuery, 1, newType);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    handleSearch(searchQuery, newPage);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalResults / 10);
  const isSearchActive = searchQuery.trim().length > 0;
  const isCompactGrid = settings?.gridLayout === 'compact';

  return (
    <div className="pb-16">
      
      {/* Hero Header Section */}
      <section className="relative pt-14 pb-10 px-4 text-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200/60">
        
        {/* Soft colorful blur backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-r from-rose-200/40 via-amber-200/30 to-purple-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Discover & Collect Cinema</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explore Millions of Movies
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Search titles powered by the OMDb API, inspect ratings, genres, and storyline plots, and save your favorites.
          </p>

          {/* SearchBar with optional autoSearch from settings */}
          <SearchBar 
            onSearch={(q) => handleSearch(q, 1)} 
            initialQuery={searchQuery}
            autoSearch={settings?.autoSearch}
          />

          {/* Media Type Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>Type:</span>
            </span>
            {[
              { id: '', label: 'All' },
              { id: 'movie', label: 'Movies' },
              { id: 'series', label: 'Series' },
              { id: 'episode', label: 'Episodes' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTypeChange(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-rose-600 text-white shadow-2xs shadow-rose-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Section title & count */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {isSearchActive ? `Search Results for "${searchQuery}"` : 'Featured Movies'}
            </h3>
          </div>

          <span className="text-xs text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            {totalResults > 0 ? `${totalResults} ${totalResults === 1 ? 'movie' : 'movies'} found` : ''}
          </span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
            <p className="text-slate-600 text-sm font-semibold">Searching movies in database...</p>
          </div>
        )}

        {/* Error / Empty State */}
        {!loading && errorMessage && (
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-white border border-rose-200 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-3 border border-rose-100">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 font-bold text-base mb-1">No Movies Found</h4>
            <p className="text-slate-600 text-sm mb-5 leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => handleSearch('Inception', 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Try "Inception"
            </button>
          </div>
        )}

        {/* Movies Grid (Adapts to Comfortable 4 cols or Compact 5 cols) */}
        {!loading && !errorMessage && movies.length > 0 && (
          <div className={`grid gap-4 sm:gap-6 ${
            isCompactGrid
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4'
          }`}>
            {movies.map((movie) => {
              const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
              return (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onSelectMovie={onSelectMovie}
                  isFavorite={isFav}
                  onToggleFavorite={onToggleFavorite}
                />
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && isSearchActive && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>

    </div>
  );
}

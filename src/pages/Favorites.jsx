import React from 'react';
import MovieCard from '../components/MovieCard';
import { Heart, Trash2, Clapperboard } from 'lucide-react';

/**
 * Favorites page styled in a bright light aesthetic.
 */
export default function Favorites({ favorites, onSelectMovie, onToggleFavorite, onClearAll, onNavigateHome }) {
  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Favorite Movies
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            {hasFavorites
              ? `You have saved ${favorites.length} ${favorites.length === 1 ? 'movie' : 'movies'} to your collection (stored in localStorage).`
              : 'Keep track of the movies you love or plan to watch.'}
          </p>
        </div>

        {hasFavorites && (
          <button
            onClick={onClearAll}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Favorites</span>
          </button>
        )}
      </div>

      {/* When favorites is empty */}
      {!hasFavorites ? (
        <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Favorites Added Yet</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            You haven't saved any movies to your watchlist yet. Tap the heart icon on any movie card or detail page to save it here!
          </p>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-md shadow-rose-600/25 transition-transform active:scale-95 cursor-pointer"
          >
            <Clapperboard className="w-4 h-4" />
            <span>Browse Popular Movies</span>
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

    </div>
  );
}

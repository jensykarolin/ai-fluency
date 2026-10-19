import React, { useState } from 'react';
import { Heart, Film, Calendar, Star } from 'lucide-react';

/**
 * MovieCard styled for a bright, modern, clean light aesthetic.
 */
export default function MovieCard({ movie, onSelectMovie, isFavorite, onToggleFavorite }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

  return (
    <div
      onClick={() => onSelectMovie(movie.imdbID)}
      className="group relative bg-white hover:bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-400/80 transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1.5 flex flex-col cursor-pointer select-none"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
        {hasValidPoster ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
                <Film className="w-8 h-8 opacity-40" />
              </div>
            )}
            <img
              src={movie.Poster}
              alt={movie.Title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100">
            <Film className="w-12 h-12 text-slate-400 mb-2" />
            <span className="text-xs text-slate-700 font-semibold line-clamp-2">
              {movie.Title}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">No Poster Available</span>
          </div>
        )}

        {/* Subtle Bottom Gradient Overlay for Rating Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Top Badges: Type & Favorite Button */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {movie.Type ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow-xs border border-white/50">
              {movie.Type}
            </span>
          ) : <span />}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="pointer-events-auto p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 transition-transform active:scale-90 border border-slate-200/80 shadow-md cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 stroke-rose-500 scale-110'
                  : 'text-slate-600 hover:text-rose-500'
              }`}
            />
          </button>
        </div>

        {/* Rating badge if available */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-amber-600 text-xs font-bold border border-slate-100 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{movie.imdbRating}</span>
          </div>
        )}
      </div>

      {/* Movie Details Footer */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3 
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors"
            title={movie.Title}
          >
            {movie.Title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {movie.Year || 'N/A'}
            </span>
            {movie.Genre && (
              <>
                <span className="text-slate-300">•</span>
                <span className="line-clamp-1 text-slate-500">{movie.Genre}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>View Details →</span>
          <span className="text-slate-400 font-mono text-[11px] font-normal">{movie.imdbID}</span>
        </div>
      </div>
    </div>
  );
}

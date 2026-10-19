import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/movieService';
import { ArrowLeft, Star, Heart, Film, Calendar, Clock, Award, Users, Video, Loader2, AlertCircle } from 'lucide-react';

/**
 * MovieDetails page styled in a bright light aesthetic.
 */
export default function MovieDetails({ movieId, onBack, isFavorite, onToggleFavorite, settings }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posterLoaded, setPosterLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getMovieDetails(movieId, settings?.plotLength || 'full');
        if (isMounted) {
          if (result.error || !result.movie) {
            setError(result.error || 'Movie details could not be retrieved.');
          } else {
            setMovie(result.movie);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch movie details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (movieId) {
      loadData();
    }
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
        <p className="text-slate-600 font-semibold">Fetching complete movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-md text-center">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Movie Not Found</h3>
        <p className="text-slate-600 text-sm mb-6">{error || 'Unable to display movie information.'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-rose-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </button>
      </div>
    );
  }

  const hasValidPoster = movie.Poster && movie.Poster !== 'N/A';
  const genres = movie.Genre ? movie.Genre.split(',').map(g => g.trim()) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold border border-slate-300 transition-all hover:-translate-x-0.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Favorite button toggle */}
        <button
          onClick={() => onToggleFavorite(movie)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
              : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
          <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Main Movie Presentation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Left: Poster */}
        <div className="md:col-span-5 lg:col-span-4 bg-slate-100 relative aspect-[2/3] md:aspect-auto flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-200">
          {hasValidPoster ? (
            <>
              {!posterLoaded && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                  <Film className="w-12 h-12 text-slate-400" />
                </div>
              )}
              <img
                src={movie.Poster}
                alt={movie.Title}
                onLoad={() => setPosterLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  posterLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-100">
              <Film className="w-16 h-16 mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No poster available</p>
            </div>
          )}

          {/* Quick rating overlay on mobile */}
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <div className="absolute top-4 right-4 md:hidden flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-amber-700 text-xs font-bold border border-amber-200 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{movie.imdbRating} / 10</span>
            </div>
          )}
        </div>

        {/* Right: Info, Plot, Metas, Cast */}
        <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            
            {/* Title & Year */}
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {movie.Title}
              </h1>
              {movie.Year && (
                <span className="text-xl sm:text-2xl font-bold text-slate-500">
                  ({movie.Year})
                </span>
              )}
            </div>

            {/* Quick Meta Row: Rating, Runtime, Rated */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-6">
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{movie.imdbRating}</span>
                  <span className="text-slate-500 text-xs font-normal">/ 10 ({movie.imdbVotes || 'N/A'} votes)</span>
                </div>
              )}

              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{movie.Runtime}</span>
                </div>
              )}

              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-700 font-semibold text-xs">
                  {movie.Rated}
                </span>
              )}

              {movie.Released && movie.Released !== 'N/A' && (
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{movie.Released}</span>
                </div>
              )}
            </div>

            {/* Genre tags */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Synopsis & Plot
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {movie.Plot && movie.Plot !== 'N/A'
                  ? movie.Plot
                  : 'No storyline or plot summary is currently available for this title.'}
              </p>
            </div>

            {/* Credits Section: Director, Actors, Awards */}
            <div className="space-y-3 pt-6 border-t border-slate-200 text-xs sm:text-sm">
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Director: </span>
                    <span className="text-slate-800">{movie.Director}</span>
                  </div>
                </div>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Cast: </span>
                    <span className="text-slate-800">{movie.Actors}</span>
                  </div>
                </div>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Awards: </span>
                    <span className="text-slate-800">{movie.Awards}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer details */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>IMDb ID: <strong className="font-mono text-slate-700">{movie.imdbID}</strong></span>
            {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
              <span>Box Office: <strong className="text-slate-700">{movie.BoxOffice}</strong></span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component styled for a crisp, bright light theme,
 * with optional debounced auto-search when enabled in Settings.
 */
export default function SearchBar({ onSearch, initialQuery = '', autoSearch = false }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debounceTimerRef = useRef(null);

  // Sync internal state if initialQuery changes from outside
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  // Debounced auto-search when enabled in Settings
  useEffect(() => {
    if (!autoSearch) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim().length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        onSearch(searchTerm.trim());
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, autoSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchTerm('');
    onSearch('');
  };

  const handleQuickTag = (tag) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchTerm(tag);
    onSearch(tag);
  };

  const quickTags = ['Batman', 'Avengers', 'Harry Potter', 'Interstellar', 'Spider-Man', 'Matrix'];

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="relative flex items-center shadow-lg shadow-slate-200/70 rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all duration-200">
        
        {/* Search Icon */}
        <div className="pl-3.5 pr-2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies by title (e.g. Inception, Avatar, Dune)..."
          className="w-full bg-transparent py-2.5 pr-3 text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors mr-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Action Button */}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-md shadow-rose-600/25 transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          Search
        </button>
      </form>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center sm:justify-start px-1 text-xs">
        <span className="text-slate-500 font-medium">Quick suggestions:</span>
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleQuickTag(tag)}
            className="px-3 py-1 rounded-full bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-medium shadow-2xs transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Film, Heart, Home as HomeIcon, Settings as SettingsIcon } from 'lucide-react';

/**
 * Header component styled with a crisp, bright light theme and navigation
 * tabs for Home, Favorites, and Settings.
 */
export default function Header({ currentPage, onNavigate, favoritesCount, isDark }) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800 shadow-sm text-slate-100'
        : 'bg-white/90 border-slate-200/80 shadow-xs text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* App Logo / Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span>Cine</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">
                Verse
              </span>
            </h1>
            <p className={`text-[10px] font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Movie Explorer
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {/* Home */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => onNavigate('favorites')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentPage === 'favorites'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${
              favoritesCount > 0 
                ? (currentPage === 'favorites' ? 'fill-white text-white' : 'fill-rose-500 text-rose-500') 
                : ''
            }`} />
            <span className="hidden sm:inline">Favorites</span>
            
            {/* Badge counter */}
            {favoritesCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full leading-none ${
                currentPage === 'favorites' ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => onNavigate('settings')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentPage === 'settings'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Settings & Preferences"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </nav>

      </div>
    </header>
  );
}

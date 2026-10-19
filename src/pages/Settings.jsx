import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Film, 
  Palette, 
  Database, 
  Check, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Trash2,
  Sliders,
  Moon,
  Sun
} from 'lucide-react';
import { testApiKey } from '../services/movieService';

/**
 * Settings page offering a complete settings form:
 * - API Key setup & connection test
 * - Search & Exploration preferences
 * - Appearance & theme toggle
 * - Data import/export & reset
 */
export default function Settings({ 
  settings, 
  onSaveSettings, 
  favorites, 
  onImportFavorites, 
  onClearFavorites 
}) {
  const [formData, setFormData] = useState({
    apiKey: settings.apiKey || 'trilogy',
    defaultType: settings.defaultType || '',
    plotLength: settings.plotLength || 'full',
    gridLayout: settings.gridLayout || 'comfortable',
    theme: settings.theme || 'light',
    autoSearch: settings.autoSearch ?? false,
  });

  // State for API connection test
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null); // { valid: boolean, message: string }

  // State for save notification toast
  const [saveToast, setSaveToast] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // { success: boolean, message: string }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear previous test result if user changes the API key
    if (field === 'apiKey') {
      setTestResult(null);
    }
  };

  const handleTestKey = async () => {
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await testApiKey(formData.apiKey);
      setTestResult(res);
    } catch (err) {
      setTestResult({ valid: false, message: 'Could not connect to OMDb.' });
    } finally {
      setTestingKey(false);
    }
  };

  const handleResetApiKey = () => {
    handleChange('apiKey', 'trilogy');
    setTestResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
    }, 3500);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all preferences to default settings?')) {
      const defaults = {
        apiKey: 'trilogy',
        defaultType: '',
        plotLength: 'full',
        gridLayout: 'comfortable',
        theme: 'light',
        autoSearch: false,
      };
      setFormData(defaults);
      onSaveSettings(defaults);
      setTestResult(null);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Export favorites to JSON file
  const handleExportFavorites = () => {
    if (!favorites || favorites.length === 0) {
      alert('You currently have no favorites to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cineverse_favorites_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import favorites from JSON file
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          // Validate items have at least imdbID and Title
          const validMovies = parsed.filter(m => m && m.imdbID && m.Title);
          if (validMovies.length > 0) {
            onImportFavorites(validMovies);
            setImportStatus({
              success: true,
              message: `Successfully imported ${validMovies.length} movie${validMovies.length > 1 ? 's' : ''}!`
            });
          } else {
            setImportStatus({
              success: false,
              message: 'The uploaded JSON file does not contain valid movie records.'
            });
          }
        } else {
          setImportStatus({
            success: false,
            message: 'Invalid file format. Expected a JSON array of movies.'
          });
        }
      } catch (err) {
        setImportStatus({
          success: false,
          message: 'Failed to read file. Please verify it is valid JSON.'
        });
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-2xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Application Settings
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Configure your OMDb API connection, exploration preferences, and data backups.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Save Toast Banner */}
      {saveToast && (
        <div className="sticky top-20 z-50 mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-md text-emerald-800 flex items-center justify-between transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Settings Saved Successfully!</p>
              <p className="text-xs text-emerald-700">Your preferences have been persisted to localStorage.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveToast(false)}
            className="text-xs font-semibold px-2 py-1 rounded-lg hover:bg-emerald-100 text-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1: OMDb API Configuration */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Key className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">OMDb API Configuration</h3>
              <p className="text-xs text-slate-500">Provide an API key to fetch real-time movie metadata</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKeyInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                OMDb API Key
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="apiKeyInput"
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="e.g. trilogy or your 8-digit key"
                  className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-sm font-mono outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15 transition-all"
                />
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testingKey}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {testingKey ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-600" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{testingKey ? 'Testing...' : 'Test Key'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetApiKey}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                    title="Reset to default key ('trilogy')"
                  >
                    Default
                  </button>
                </div>
              </div>

              {/* Test key result message */}
              {testResult && (
                <div className={`mt-2.5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResult.valid
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span>The default demo key is <code>trilogy</code>. Need your own free key?</span>
                <a
                  href="https://www.omdbapi.com/apikey.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  <span>Request key at omdbapi.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Search & Exploration Preferences */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Sliders className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Browsing & Search Preferences</h3>
              <p className="text-xs text-slate-500">Fine-tune how results and details are fetched and displayed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Default Content Type */}
            <div>
              <label htmlFor="defaultTypeSelect" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Default Content Filter
              </label>
              <select
                id="defaultTypeSelect"
                value={formData.defaultType}
                onChange={(e) => handleChange('defaultType', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm font-medium outline-none focus:border-rose-500 focus:bg-white focus:ring-3 focus:ring-rose-500/15 cursor-pointer transition-all"
              >
                <option value="">All Content (Movies, Series & Episodes)</option>
                <option value="movie">Movies Only</option>
                <option value="series">TV Series Only</option>
                <option value="episode">Episodes Only</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Filters new searches by this media type by default.</p>
            </div>

            {/* Plot Detail Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detail Page Plot Length
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  formData.plotLength === 'full' 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/15' 
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="plotLength"
                    value="full"
                    checked={formData.plotLength === 'full'}
                    onChange={() => handleChange('plotLength', 'full')}
                    className="sr-only"
                  />
                  <span>Full Plot</span>
                </label>

                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  formData.plotLength === 'short' 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/15' 
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="plotLength"
                    value="short"
                    checked={formData.plotLength === 'short'}
                    onChange={() => handleChange('plotLength', 'short')}
                    className="sr-only"
                  />
                  <span>Short Synopsis</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Full plot provides extended storyline synopsis.</p>
            </div>

            {/* Grid Density */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Results Grid Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  formData.gridLayout === 'comfortable' 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/15' 
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="gridLayout"
                    value="comfortable"
                    checked={formData.gridLayout === 'comfortable'}
                    onChange={() => handleChange('gridLayout', 'comfortable')}
                    className="sr-only"
                  />
                  <span>Comfortable (4 cols)</span>
                </label>

                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  formData.gridLayout === 'compact' 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/15' 
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="gridLayout"
                    value="compact"
                    checked={formData.gridLayout === 'compact'}
                    onChange={() => handleChange('gridLayout', 'compact')}
                    className="sr-only"
                  />
                  <span>Compact (5 cols)</span>
                </label>
              </div>
            </div>

            {/* Auto Search on Type Toggle */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Live Auto-Search</span>
                  <span className="block text-[11px] text-slate-500">Search automatically as you type</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoSearch}
                  onChange={(e) => handleChange('autoSearch', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 accent-rose-600 cursor-pointer"
                />
              </label>
            </div>

          </div>
        </section>

        {/* Section 3: Appearance & Theme */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Palette className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Theme & Visual Style</h3>
              <p className="text-xs text-slate-500">Choose between the bright light look and a dark cinema experience</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Light Mode Option */}
            <div 
              onClick={() => handleChange('theme', 'light')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                formData.theme === 'light'
                  ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Bright Light Mode</p>
                <p className="text-xs text-slate-500">Crisp, airy white background with high contrast</p>
              </div>
            </div>

            {/* Dark Mode Option */}
            <div 
              onClick={() => handleChange('theme', 'dark')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                formData.theme === 'dark'
                  ? 'border-rose-600 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-900 text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-rose-400 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Dark Cinema Mode</p>
                <p className="text-xs text-slate-400">Deep movie-theater dark palette</p>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Data & Backup Management */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Database className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Favorites & Backup Management</h3>
              <p className="text-xs text-slate-500">Export or import your saved collection of movies</p>
            </div>
          </div>

          {importStatus && (
            <div className={`mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Export */}
            <button
              type="button"
              onClick={handleExportFavorites}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Favorites ({favorites?.length || 0})</span>
            </button>

            {/* Import */}
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Import Favorites JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="sr-only"
              />
            </label>

            {/* Clear favorites */}
            {favorites?.length > 0 && (
              <button
                type="button"
                onClick={onClearFavorites}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Favorites</span>
              </button>
            )}
          </div>
        </section>

        {/* Form Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleResetAll}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset All to Defaults
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-md shadow-rose-600/25 active:scale-98 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
}

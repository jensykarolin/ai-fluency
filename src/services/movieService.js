// OMDb API Service
// Free public educational key provided by default, with custom key support, settings integration, and fallback data

const DEFAULT_API_KEY = 'trilogy'; // Default working demo key for learning & coursework
const BASE_URL = 'https://www.omdbapi.com/';
const SETTINGS_STORAGE_KEY = 'cineverse_settings';

/**
 * Retrieves the active API key from saved settings or falls back to default.
 */
export function getActiveApiKey() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.apiKey.trim()) {
        return parsed.apiKey.trim();
      }
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_API_KEY;
}

/**
 * Tests an OMDb API key with a fast verification request.
 * @param {string} keyToTest 
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export async function testApiKey(keyToTest) {
  const key = (keyToTest || '').trim();
  if (!key) {
    return { valid: false, message: 'API key cannot be empty.' };
  }

  try {
    const res = await fetch(`${BASE_URL}?apikey=${encodeURIComponent(key)}&s=Batman&page=1`);
    const data = await res.json();
    if (data.Response === 'True') {
      return { valid: true, message: 'API key is valid and working!' };
    }
    return { valid: false, message: data.Error || 'Invalid API key or request rejected by OMDb.' };
  } catch (err) {
    return { valid: false, message: 'Network error while validating API key.' };
  }
}

// Curated fallback data for popular movies in case of network restrictions or API limits
const FALLBACK_MOVIES = [
  {
    imdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2MmI0XkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Drama',
    imdbRating: '9.3',
    Plot: 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.'
  },
  {
    imdbID: 'tt0468569',
    Title: 'The Dark Knight',
    Year: '2008',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    Genre: 'Action, Crime, Drama',
    imdbRating: '9.0',
    Plot: 'When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.'
  },
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    Genre: 'Action, Adventure, Sci-Fi',
    imdbRating: '8.8',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Action, Sci-Fi',
    imdbRating: '8.7',
    Plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.'
  },
  {
    imdbID: 'tt0816692',
    Title: 'Interstellar',
    Year: '2014',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Adventure, Drama, Sci-Fi',
    imdbRating: '8.7',
    Plot: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.'
  },
  {
    imdbID: 'tt0109830',
    Title: 'Forrest Gump',
    Year: '1994',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Drama, Romance',
    imdbRating: '8.8',
    Plot: 'The history of the United States from the 1950s to the 1970s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.'
  },
  {
    imdbID: 'tt0110912',
    Title: 'Pulp Fiction',
    Year: '1994',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3NWMtPCs0YS00YTNlLTg2MDAtODlhOWFiYzZhY2M0XkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Crime, Drama',
    imdbRating: '8.9',
    Plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
  },
  {
    imdbID: 'tt0120737',
    Title: 'The Lord of the Rings: The Fellowship of the Ring',
    Year: '2001',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg',
    Genre: 'Action, Adventure, Drama',
    imdbRating: '8.9',
    Plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.'
  }
];

/**
 * Searches movies by title using OMDb API
 * @param {string} query - Movie search term
 * @param {number} page - Page number (defaults to 1)
 * @param {Object} options - Search filter options (type, customApiKey)
 * @returns {Promise<{ movies: Array, totalResults: number, error?: string }>}
 */
export async function searchMovies(query, page = 1, options = {}) {
  const trimmed = query ? query.trim() : '';
  if (!trimmed) {
    return { movies: FALLBACK_MOVIES, totalResults: FALLBACK_MOVIES.length };
  }

  const apiKey = options.apiKey || getActiveApiKey();
  const typeParam = options.type ? `&type=${encodeURIComponent(options.type)}` : '';

  try {
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(trimmed)}&page=${page}${typeParam}`);
    const data = await response.json();

    if (data.Response === 'True') {
      return {
        movies: data.Search || [],
        totalResults: parseInt(data.totalResults, 10) || 0
      };
    } else {
      // If OMDb returns an error (e.g. "Movie not found!" or key limit)
      // Check if fallback matches query for offline resilience
      const localMatches = FALLBACK_MOVIES.filter(m =>
        m.Title.toLowerCase().includes(trimmed.toLowerCase())
      );

      if (localMatches.length > 0) {
        return { movies: localMatches, totalResults: localMatches.length };
      }

      return {
        movies: [],
        totalResults: 0,
        error: data.Error || 'No movies found.'
      };
    }
  } catch (err) {
    console.warn('OMDb network error, falling back to local dataset:', err);
    const localMatches = FALLBACK_MOVIES.filter(m =>
      m.Title.toLowerCase().includes(trimmed.toLowerCase())
    );
    return {
      movies: localMatches.length > 0 ? localMatches : FALLBACK_MOVIES,
      totalResults: localMatches.length > 0 ? localMatches.length : FALLBACK_MOVIES.length,
      isOfflineFallback: true
    };
  }
}

/**
 * Gets detailed information for a specific movie by imdbID
 * @param {string} imdbID - The IMDb identifier
 * @param {string} plot - 'short' or 'full' (defaults to 'full')
 * @returns {Promise<{ movie: Object|null, error?: string }>}
 */
export async function getMovieDetails(imdbID, plot = 'full') {
  if (!imdbID) return { movie: null, error: 'No movie ID provided.' };

  const apiKey = getActiveApiKey();
  const plotParam = plot === 'short' ? 'short' : 'full';

  try {
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(imdbID)}&plot=${plotParam}`);
    const data = await response.json();

    if (data.Response === 'True') {
      return { movie: data };
    }

    // Check fallback
    const fallback = FALLBACK_MOVIES.find(m => m.imdbID === imdbID);
    if (fallback) {
      return { movie: fallback };
    }

    return { movie: null, error: data.Error || 'Movie details not found.' };
  } catch (err) {
    console.warn('OMDb network error fetching details:', err);
    const fallback = FALLBACK_MOVIES.find(m => m.imdbID === imdbID);
    if (fallback) {
      return { movie: fallback };
    }
    return { movie: null, error: 'Failed to load movie details from network.' };
  }
}

/**
 * Returns default featured/popular movies for initial screen
 */
export function getInitialFeaturedMovies() {
  return FALLBACK_MOVIES;
}

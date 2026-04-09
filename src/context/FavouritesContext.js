import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { movieFavouriteService, userService, movieService, APP_USER_ID } from '../services/api';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [favouriteRecords, setFavouriteRecords] = useState([]);
  const [moviesMap, setMoviesMap] = useState({});
  const [resolvedUserId, setResolvedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine which token to resolve:
  // - Logged in: use user.token from login response
  // - Not logged in: use APP_USER_ID from .env (the app-level User-Id header)
  const tokenToResolve = isAuthenticated && user?.token ? user.token : APP_USER_ID;

  // Step 1: Always resolve DB user.id via /users/get-by-token/v1/{token}
  useEffect(() => {
    if (!tokenToResolve) return;

    let cancelled = false;
    async function resolveUser() {
      try {
        const result = await userService.getByToken(tokenToResolve);
        const userData = Array.isArray(result) ? result[0] : result;
        if (!cancelled && userData?.id) {
          setResolvedUserId(userData.id);
        }
      } catch (err) {
        console.error('Failed to resolve user by token:', err);
        // If logged in and getByToken fails, fallback to user.id from login response
        if (!cancelled && isAuthenticated && user?.id) {
          setResolvedUserId(user.id);
        }
      }
    }
    resolveUser();
    return () => { cancelled = true; };
  }, [tokenToResolve, isAuthenticated, user]);

  // Step 2: Fetch favourites by user + movies for card rendering
  const fetchFavourites = useCallback(async () => {
    if (!resolvedUserId) return;
    setLoading(true);
    setError(null);
    try {
      const [favData, allMovies] = await Promise.all([
        movieFavouriteService.getByUser(resolvedUserId),
        movieService.getAll(),
      ]);

      const records = Array.isArray(favData) ? favData : [];
      setFavouriteRecords(records);

      const movieArr = Array.isArray(allMovies) ? allMovies : [];
      const map = {};
      movieArr.forEach((m) => { map[m.id] = m; });
      setMoviesMap(map);
    } catch (err) {
      console.error('Failed to fetch favourites:', err);
      if (err.status === 403) {
        setError('Permission denied loading favourites. Your session may have expired — try logging out and back in.');
      } else {
        setError(err.message || 'Failed to load favourites');
      }
      setFavouriteRecords([]);
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  // Derived: full movie objects for MovieCard rendering
  const favouriteMovies = favouriteRecords
    .map((rec) => moviesMap[rec.movie_id])
    .filter(Boolean);

  const isFavourite = useCallback(
    (movieId) => favouriteRecords.some((rec) => rec.movie_id === movieId),
    [favouriteRecords]
  );

  const getFavouriteRecord = useCallback(
    (movieId) => favouriteRecords.find((rec) => rec.movie_id === movieId),
    [favouriteRecords]
  );

  const addFavourite = useCallback(async (movie) => {
    if (!resolvedUserId) return;
    if (isFavourite(movie.id)) return;

    setActionLoading(true);
    setError(null);
    try {
      const newRec = await movieFavouriteService.create({
        movie_id: movie.id,
        user_id: resolvedUserId,
      });
      const rec = Array.isArray(newRec) ? newRec[0] : newRec;
      if (rec) {
        setFavouriteRecords((prev) => [...prev, rec]);
        setMoviesMap((prev) => ({ ...prev, [movie.id]: movie }));
      }
    } catch (err) {
      console.error('Failed to add favourite:', err);
      if (err.status === 403) {
        setError('Permission denied. Try logging out and back in.');
      }
    } finally {
      setActionLoading(false);
    }
  }, [resolvedUserId, isFavourite]);

  const removeFavourite = useCallback(async (movieId) => {
    const record = getFavouriteRecord(movieId);
    if (!record) return;

    setActionLoading(true);
    setError(null);
    try {
      await movieFavouriteService.delete(record.id);
      setFavouriteRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      console.error('Failed to remove favourite:', err);
      if (err.status === 403) {
        setError('Permission denied. Try logging out and back in.');
      }
    } finally {
      setActionLoading(false);
    }
  }, [getFavouriteRecord]);

  return (
    <FavouritesContext.Provider
      value={{
        favourites: favouriteMovies,
        favouriteRecords,
        addFavourite,
        removeFavourite,
        isFavourite,
        loading,
        actionLoading,
        error,
        resolvedUserId,
        refreshFavourites: fetchFavourites,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}

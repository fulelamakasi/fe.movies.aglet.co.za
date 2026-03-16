import React, { createContext, useContext, useState, useCallback } from 'react';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  });

  const addFavourite = useCallback((movie) => {
    setFavourites((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      localStorage.setItem('favourites', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavourite = useCallback((movieId) => {
    setFavourites((prev) => {
      const next = prev.filter((m) => m.id !== movieId);
      localStorage.setItem('favourites', JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (movieId) => favourites.some((m) => m.id === movieId),
    [favourites]
  );

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}

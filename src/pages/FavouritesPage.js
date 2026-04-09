import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import MovieCard from '../components/MovieCard';
import { MdFavoriteBorder } from 'react-icons/md';

export default function FavouritesPage() {
  const { favourites, loading, error } = useFavourites();

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>My Favourites</h2>
        </div>
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading your favourites...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>My Favourites</h2>
        <p>Your personal collection of favourite movies ({favourites.length} saved)</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {favourites.length === 0 && !error ? (
        <div className="empty-state">
          <MdFavoriteBorder />
          <h3>No Favourites Yet</h3>
          <p>Browse movies and click the heart icon to add them here.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favourites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

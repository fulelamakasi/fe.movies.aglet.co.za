import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import MovieCard from '../components/MovieCard';
import { MdFavoriteBorder } from 'react-icons/md';

export default function FavouritesPage() {
  const { favourites } = useFavourites();

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>My Favourites</h2>
        <p>Your personal collection of favourite movies ({favourites.length} saved)</p>
      </div>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <MdFavoriteBorder />
          <h3>No Favourites Yet</h3>
          <p>Browse movies and click the heart icon to add them here.</p>
        </div>
      ) : (
        <div className="favourites-grid">
          {favourites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

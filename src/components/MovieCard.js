import React from 'react';
import { MdStar, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useFavourites } from '../context/FavouritesContext';

const TMDB_IMG = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }) {
  const { addFavourite, removeFavourite, isFavourite, actionLoading } = useFavourites();
  const fav = isFavourite(movie.id);

  const posterSrc = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_IMG}${movie.poster_path}`)
    : null;

  const handleFavClick = (e) => {
    e.stopPropagation();
    if (actionLoading) return;
    fav ? removeFavourite(movie.id) : addFavourite(movie);
  };

  return (
    <div className="movie-card fade-in">
      {posterSrc ? (
        <img
          className="movie-card-poster"
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className="movie-card-poster-placeholder"
        style={posterSrc ? { display: 'none' } : {}}
      >
        NO POSTER
      </div>

      <div className="movie-card-body">
        <div className="movie-card-title" title={movie.title}>{movie.title}</div>
        <div className="movie-card-date">{movie.release_date || 'Unknown date'}</div>
        <div className="movie-card-actions">
          <div className="movie-card-rating">
            <MdStar />
            {movie.vote_average || '—'}
          </div>
          <button
            className={`btn-favourite${fav ? ' is-favourite' : ''}`}
            onClick={handleFavClick}
            disabled={actionLoading}
            title={fav ? 'Remove from favourites' : 'Add to favourites'}
            style={actionLoading ? { opacity: 0.5 } : {}}
          >
            {fav ? <MdFavorite /> : <MdFavoriteBorder />}
          </button>
        </div>
      </div>
    </div>
  );
}

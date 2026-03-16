import React, { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const PER_PAGE = 9;
const MAX_MOVIES = 45;

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await movieService.getAll();
        const arr = Array.isArray(data) ? data : [];
        // Limit to 45 movies as per requirement
        setAllMovies(arr.slice(0, MAX_MOVIES));
      } catch (err) {
        setError(err.message || 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalPages = Math.ceil(allMovies.length / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const currentMovies = allMovies.slice(startIdx, startIdx + PER_PAGE);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading movies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>Popular Movies</h2>
        <p>Browse through our collection of {allMovies.length} movies — showing {PER_PAGE} per page</p>
      </div>

      {currentMovies.length === 0 ? (
        <div className="empty-state">
          <h3>No Movies Available</h3>
          <p>Check back later or contact the administrator.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {currentMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <MdChevronLeft /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-btn${p === page ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <MdChevronRight />
              </button>

              <span className="pagination-info">
                Page {page} of {totalPages} &middot; {allMovies.length} movies
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React from 'react';
import CrudPage from '../components/CrudPage';
import { movieService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'tmdb_id', label: 'TMDB ID' },
  { key: 'title', label: 'Title' },
  { key: 'release_date', label: 'Release Date' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'language_id', label: 'Language ID' },
];

const formFields = [
  { key: 'tmdb_id', label: 'TMDB ID', required: true, type: 'number' },
  { key: 'title', label: 'Title', required: true },
  { key: 'overview', label: 'Overview', type: 'textarea', required: true },
  { key: 'release_date', label: 'Release Date', required: true, placeholder: '04 August 1999' },
  { key: 'poster_path', label: 'Poster Path', required: true },
  { key: 'backdrop_path', label: 'Backdrop Path', required: true },
  { key: 'popularity', label: 'Popularity', required: true },
  { key: 'vote_average', label: 'Vote Average', required: true },
  { key: 'vote_count', label: 'Vote Count', required: true },
  { key: 'language_id', label: 'Language ID', required: true, type: 'number' },
];

export default function AdminMoviesPage() {
  return (
    <CrudPage
      title="Movies"
      subtitle="Manage movie records in the database"
      service={movieService}
      columns={columns}
      formFields={formFields}
    />
  );
}

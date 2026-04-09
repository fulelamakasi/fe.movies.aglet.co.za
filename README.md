# Aglet Movie Database — React Frontend

A cinematic dark-themed React SPA that consumes the Aglet Movie DB Flask API. Built to display movies from TMDB with pagination, favourites, a contact form, and full CRUD administration screens for all API models.

---

## Features

### Public Pages (no login required)
- **Movies** — Browse 45 movies in a 3×3 grid, paginated 9 per page with prev/next navigation
- **Favourites** — Client-side favourites list (heart icon on movie cards to add/remove)
- **Contact Us** — Submit enquiries via the `/contact_us/v1` API endpoint

### Admin Pages (login required)
Full CRUD (Create, Read, Update, Delete) for every API model:
- Movies, Languages, Users, Roles, Permissions, Role Permissions, User Roles, Contact Submissions

### Authentication & Dual-Token Architecture
- **Before login**: All API requests use the app-level `User-Id` from the `.env` file (`REACT_APP_USER_ID`)
- **After login**: The `User-Id` header is swapped to the user's `token` from the login response
- **On logout**: Reverts to the app-level token

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.js          # Navigation sidebar with brand, links, user info
│   ├── MovieCard.js         # Movie poster card with favourite toggle
│   ├── Modal.js             # Reusable modal dialog
│   └── CrudPage.js          # Generic CRUD table/form component
├── context/
│   ├── AuthContext.js        # Auth state, login/logout, token management
│   └── FavouritesContext.js  # Client-side favourites with localStorage
├── pages/
│   ├── MoviesPage.js         # Main movie browsing with 9-per-page pagination
│   ├── FavouritesPage.js     # Favourites collection view
│   ├── ContactPage.js        # Contact form + info
│   ├── LoginPage.js          # Login screen
│   ├── AdminMoviesPage.js    # CRUD: Movies
│   ├── AdminLanguagesPage.js # CRUD: Languages
│   ├── AdminUsersPage.js     # CRUD: Users
│   ├── AdminRolesPage.js     # CRUD: Roles
│   ├── AdminPermissionsPage.js       # CRUD: Permissions
│   ├── AdminRolePermissionsPage.js   # CRUD: Role Permissions
│   ├── AdminUserRolesPage.js         # CRUD: User Roles
│   └── AdminContactUsPage.js         # CRUD: Contact Submissions
├── services/
│   └── api.js                # Centralised API client with all endpoints
├── App.js                    # Router & layout
├── index.js                  # Entry point
└── index.css                 # Global styles (dark cinematic theme)
```

---

## Setup & Run

### Prerequisites
- Node.js 16+
- The Aglet Movie DB Flask API running on `http://127.0.0.1:5000`

### Install
```bash
cd aglet-moviedb
npm install
```

### Configure
Edit `.env` to match your API:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:5000/api
REACT_APP_USER_ID=10235463-8728-0913-9837-127634524310
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

- `REACT_APP_API_BASE_URL` — Your Flask API base URL
- `REACT_APP_USER_ID` — The app-level UUID used for the `User-Id` header before a user logs in
- `REACT_APP_TMDB_IMAGE_BASE_URL` — TMDB image CDN base (poster images are loaded from `{base}{poster_path}`)

### Run Development Server
```bash
npm start
```

Opens at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

---

## API Endpoints Consumed

| Module            | Endpoints                                           |
|-------------------|-----------------------------------------------------|
| Auth              | `POST /auth/login/v1`, `PUT /auth/renew-token/v1`  |
| Movies            | CRUD `/movies/v1`, `/movies/get-active/v1/{flag}`, `/movies/get-by-language/v1/{id}` |
| Contact Us        | CRUD `/contact_us/v1`, `/contact_us/get-actioned/v1/{flag}` |
| Languages         | CRUD `/languages/v1`, `/languages/get-active/v1/{flag}` |
| Users             | CRUD `/users/v1`, `/users/get-active/v1/{flag}`    |
| Roles             | CRUD `/roles/v1`, `/roles/get-active/v1/{flag}`    |
| Permissions       | CRUD `/permissions/v1`, `/permissions/get-active/v1/{flag}` |
| Role Permissions  | CRUD `/role_permissions/v1` + filter endpoints      |
| User Roles        | CRUD `/user_roles/v1` + filter endpoints            |

All requests include the `User-Id` header (app token or user token after login).

---

## Design

- **Theme**: Cinematic dark UI inspired by streaming platforms
- **Fonts**: Bebas Neue (display/headings) + DM Sans (body)
- **Colors**: Deep navy blacks, Netflix-red accent (#e50914), IMDB-gold for ratings
- **Layout**: Fixed sidebar navigation + scrollable main content area

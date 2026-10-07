# GameShelf

GameShelf is a responsive frontend prototype for organizing a personal video game collection and backlog. It provides a private, searchable library experience without requiring a backend or account.

## Features

- Search by title, edition, platform, and tags
- Filter by platform, play status, ownership, format, favorite status, rating, completion, release year, and tag
- Sort by title, date added, last updated, rating, release year, or platform
- Switch between grid and list views
- Browse a built-in catalog of 100 games
- Add games from the catalog or enter them manually
- View and edit detailed collection information
- Track ratings, progress, hours played, dates, acquisition details, tags, favorites, and notes
- Move entries to a recoverable 30-day trash view
- Restore or permanently delete trashed entries
- Export library data as JSON or CSV
- Preserve filters and view state in the URL
- Save library preferences in the browser

## Running the project

No build step or package installation is required.

You can open `index.html` directly in a browser. For behavior that is closest to a hosted website, serve the repository with a local HTTP server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```text
video_game_library/
├── assets/
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── app.js
├── docs/
│   └── PERSONAL_GAME_LIBRARY_PLAN.md
├── .gitignore
├── index.html
├── library.html
└── README.md
```

## Data storage

This prototype stores data in browser `localStorage`:

- `gameshelf-games-v2` stores active and trashed game entries.
- `gameshelf-preferences` stores view and pagination preferences.
- `gameshelf-games` is read only when migrating data from an earlier prototype version.

Data remains on the current browser profile and website origin. It does not synchronize between browsers or devices. Clearing site data removes the saved library, so JSON or CSV export should be used for backups.

## Main pages

- `index.html` introduces GameShelf and links to the app.
- `library.html` contains the interactive collection manager.

## Accessibility

The prototype uses native controls and dialogs, visible keyboard focus, a skip link, descriptive labels, live status messages, reduced-motion support, and responsive layouts for narrow screens.

## Current scope

This repository implements the frontend-only prototype selected for the project. Authentication, server APIs, PostgreSQL storage, multi-device synchronization, background jobs, and production security controls described in the product plan require a separate backend implementation.

See [the product plan](docs/PERSONAL_GAME_LIBRARY_PLAN.md) for the complete intended MVP requirements.

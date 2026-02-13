# Nonograms

A client-side web application for creating, browsing, and playing Nonogram puzzles (also known as Picross, Griddlers, or Paint by Numbers). No server or build step required — open `index.html` in a browser and start playing.

## Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari, or Opera)
- Optional: any static file server (Python, Node.js, etc.) if you prefer serving over `http://`

> **Note:** Camera capture in the "Solve Puzzle" view requires an HTTPS origin or `localhost`.

## Getting Started

### Clone

```bash
git clone https://github.com/MSBart2/Nonograms.git
cd Nonograms
```

### Run

Open `index.html` directly in your browser, or start a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Then visit `http://localhost:8000`.

### First-Time Setup

1. **Register** — enter a username (≥ 3 chars) and password (≥ 6 chars), then click "Register".
2. **Create a puzzle** — go to *Create Puzzle*, pick a name and grid size (5×5, 10×10, 15×15, or 20×20), click cells to toggle them, and save.
3. **Play** — go to *Browse Puzzles*, click a card, and solve it.

### Controls

| Action | Input |
|---|---|
| Fill a cell | Left-click |
| Mark a cell empty | Right-click **or** Shift+click |
| Check solution | "Check Solution" button |
| Reset progress | "Reset" button |

## Testing

There is currently no test suite or linter configured for this project. Contributions to add testing are welcome (see [Contributing](#contributing)).

## Architecture

The application is a zero-dependency, static site built with vanilla HTML, CSS, and JavaScript. All state is stored in the browser via `localStorage` (puzzles and user accounts) and `sessionStorage` (current login session).

```
Nonograms/
├── index.html              # Single-page application shell
├── css/
│   └── styles.css          # All styling and responsive layout
├── js/
│   ├── app.js              # Top-level UI logic and event wiring
│   ├── auth.js             # Registration, login, logout (localStorage)
│   ├── storage.js          # CRUD operations for puzzle data (localStorage)
│   ├── nonogram.js         # Puzzle model, clue calculation, grid rendering
│   ├── photoProcessor.js   # Image-to-grid conversion (grayscale threshold)
│   └── solver.js           # Constraint-propagation solver (work-in-progress)
├── .github/
│   └── workflows/
│       └── copilot-assignment.yml  # Auto-assigns Copilot to new issues
├── .gitignore
└── README.md
```

### Key Modules

| Module | Responsibility |
|---|---|
| `auth.js` | User accounts stored in `localStorage`. Passwords are base64-encoded — **this is for demo purposes only and is not secure**. |
| `storage.js` | Saves and retrieves puzzles from `localStorage`, supports filtering by grid size. |
| `nonogram.js` | Core game logic: creates grids, computes row/column clues, renders the editor and play views, and checks solutions. |
| `photoProcessor.js` | Converts an uploaded image to a black-and-white grid using a fixed grayscale threshold (128). |
| `solver.js` | Contains a constraint-propagation line solver. **Note:** the solver is not yet integrated into the main application UI; the "Solve Puzzle" view currently processes images through `photoProcessor` instead. |

### Data Flow

1. Scripts are loaded in order via `<script>` tags (no module bundler).
2. Each module registers a singleton on `window` (e.g., `window.authManager`, `window.storageManager`).
3. `app.js` initialises last, reads the login state, and wires up all DOM event listeners.

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes — there is no build step, so just edit and reload the browser.
3. Open a pull request against `main` with a clear description of what changed and why.

### Branch Naming

| Prefix | Use |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring with no behaviour change |

### Code Style

- Vanilla JavaScript with ES6 `class` syntax.
- No external dependencies — keep it that way unless there is a strong reason.
- Comment code only where the intent is non-obvious.

## Credits

Created with ❤️ for puzzle enthusiasts everywhere.

Nonograms were invented by Non Ishida and Tetsuya Nishio in Japan in the late 1980s.
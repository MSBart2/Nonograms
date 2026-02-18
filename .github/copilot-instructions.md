# Copilot Instructions for Nonograms

## Project Overview

A zero-dependency, client-side web application for creating and playing Nonogram puzzles (also known as Picross, Griddlers, or Paint by Numbers). Built with vanilla HTML, CSS, and JavaScript — no build step, no bundler, no external dependencies.

## Testing and Development

There is **no test suite or linter** configured for this project. Test manually by:
- Opening `index.html` in a browser (or serving via `python -m http.server 8000`)
- Loading `test-solver.html` for automated solver tests
- Loading `load-sample-puzzles.html` to generate sample puzzles for testing

## Architecture and Module Loading

### Global Module Pattern

All JavaScript modules are **singleton objects registered on `window`**, loaded via `<script>` tags in strict order (no ES modules or bundler):

```html
<script src="js/auth.js"></script>         <!-- window.authManager -->
<script src="js/storage.js"></script>      <!-- window.storageManager -->
<script src="js/nonogram.js"></script>     <!-- window.nonogramGame -->
<script src="js/photoProcessor.js"></script> <!-- window.photoProcessor -->
<script src="js/solver.js"></script>       <!-- window.nonogramSolver -->
<script src="js/app.js"></script>          <!-- window.app (initializes last) -->
```

**CRITICAL**: When modifying modules, maintain the global singleton pattern:
```javascript
class MyModule {
    constructor() { /* ... */ }
}
window.myModule = new MyModule();
```

### Module Responsibilities

| Module | Purpose | Key Methods |
|--------|---------|-------------|
| `auth.js` | User registration/login using `localStorage` | `register()`, `login()`, `logout()`, `isLoggedIn()` |
| `storage.js` | CRUD operations for puzzles in `localStorage` | `savePuzzle()`, `getAllPuzzles()`, `getPuzzlesBySize()` |
| `nonogram.js` | Core game logic: grids, clues, rendering | `createGrid()`, `calculateClues()`, `renderPlayGrid()`, `checkSolution()` |
| `photoProcessor.js` | Image-to-grid conversion (grayscale threshold) | `processImage()` (threshold=128) |
| `solver.js` | Constraint-propagation line solver | `solveFromClues()`, `solveLine()` |
| `app.js` | Top-level UI orchestration and event wiring | `showView()`, `handleLogin()`, `setupEventListeners()` |

### Data Flow

1. Scripts load in order (no async/defer)
2. Each module creates a singleton on `window` immediately
3. `app.js` loads last, reads `sessionStorage` for login state, wires up DOM events
4. All state persists in `localStorage` (puzzles, users) and `sessionStorage` (current login)

## Key Implementation Conventions

### Storage Schema

**Puzzles** (`localStorage` key: `nonogram_puzzles`):
```javascript
{
  id: "unique_id",              // Date.now() + random string
  name: "Puzzle Name",
  size: 10,                     // Grid size (5-50)
  grid: [[0,1,0], [1,1,1], ...], // 2D array (0=empty, 1=filled)
  rowClues: [[1,2], [3], ...],
  colClues: [[2], [1,1], ...],
  createdBy: "username",
  createdAt: "ISO 8601 timestamp"
}
```

**Users** (`localStorage` key: `nonogram_users`):
```javascript
{
  "username": {
    password: "base64_encoded",  // btoa(password) - DEMO ONLY, NOT SECURE
    createdAt: "ISO 8601 timestamp"
  }
}
```

**Session** (`sessionStorage` key: `nonogram_session`):
```javascript
{
  username: "current_user",
  loginTime: "ISO 8601 timestamp"
}
```

### Grid Coordinates and Rendering

- **Grid**: 2D array `grid[row][col]` where `0` = empty, `1` = filled
- **Canvas rendering**: Each cell is a `<div>` with classes `cell`, `filled`, `marked`
- **Clues**: Arrays of integers, e.g., `[3, 1, 2]` means "3 consecutive, gap, 1, gap, 2"
- **Empty rows/columns**: Represented as `[0]` in clue arrays

### Solver Implementation

The solver uses **line-solving with constraint propagation**:
- Works row-by-row and column-by-column repeatedly
- Cells: `-1` = unknown (yellow), `0` = empty, `1` = filled (black)
- **Limitation**: Cannot solve puzzles requiring backtracking/guessing
- Solver state: `UNKNOWN` (yellow) cells indicate partial solutions

When adding solver features:
- Always validate clues match grid dimensions
- Handle edge case: clues `[0]` = empty line
- Preserve the "Save to My Puzzles" button integration

### Photo Processing

- Uses `<canvas>` with grayscale threshold (fixed at 128)
- Conversion: `gray = 0.299*R + 0.587*G + 0.114*B`
- Output: Grid where `cell = gray < 128 ? 1 : 0`

## Common Tasks

### Adding a New View

1. Add menu item in `index.html` sidebar:
   ```html
   <button class="menu-item" data-view="myView">
     <span class="icon">🎯</span>
     <span>My View</span>
   </button>
   ```

2. Add view container in `index.html`:
   ```html
   <div id="myView" class="view">
     <h2>My View</h2>
     <!-- content -->
   </div>
   ```

3. Wire up in `app.js` (menu items auto-bind to `showView()` via `data-view` attribute)

### Modifying the Solver

- Edit `solver.js` → `solveLine()` for single-line logic
- Edit `solver.js` → `solveFromClues()` for multi-pass iteration
- Test with `test-solver.html` (6 automated test cases)

### Adding Grid Sizes

Grid sizes are hardcoded in multiple places:
- `index.html`: Create Puzzle form `<select>` options
- `index.html`: Browse Puzzles filter `<select>` options
- `generate-sample-puzzles.js`: Sample generator size array

### Changing Authentication

**Warning**: Current auth uses base64 encoding (NOT SECURE). For production:
1. Replace `btoa(password)` in `auth.js` with proper hashing (e.g., bcrypt.js)
2. Add HTTPS requirement
3. Consider backend authentication instead of localStorage

## File Organization

```
Nonograms/
├── index.html                   # Main SPA shell
├── load-sample-puzzles.html     # Utility to generate 100 sample puzzles
├── test-solver.html             # Automated solver test suite
├── generate-sample-puzzles.js   # Standalone puzzle generator (imported by load-sample-puzzles.html)
├── css/
│   └── styles.css               # All styling (grid, cards, responsive)
├── js/
│   ├── app.js                   # UI controller (loads last)
│   ├── auth.js                  # localStorage-based user accounts
│   ├── storage.js               # localStorage puzzle CRUD
│   ├── nonogram.js              # Game logic, clue calculation, rendering
│   ├── photoProcessor.js        # Image → grid converter
│   └── solver.js                # Constraint-propagation solver
└── .github/
    └── workflows/
        └── copilot-assignment.yml  # Auto-assigns Copilot to issues
```

## CSS and Styling

- **CSS Grid** for layout (`.main-grid`, `.puzzle-grid`)
- **BEM-style classes** loosely followed (e.g., `.menu-item`, `.btn-primary`)
- **Responsive breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Theme**: CSS variables in `:root` for colors (currently not defined, uses direct colors)

When adding UI:
- Use existing `.card`, `.btn`, `.form-group` classes
- Maintain emoji icons in menu items for consistency
- Keep mobile-first responsive design

## Utilities and Tools

### `load-sample-puzzles.html`
- Generates 100 puzzles (10 patterns × 10 sizes)
- Patterns: Checkerboard, Frame, Diagonal, Cross, Diamond, Circle, Stripes, etc.
- Uses `generate-sample-puzzles.js` module
- Can clear all puzzles and regenerate

### `test-solver.html`
- Runs 6 automated solver tests (5×5 to 10×10)
- Visual pass/fail indicators
- Tests cover: empty grid, simple cross, checkerboard, diagonal, heart, complex patterns

### `generate-sample-puzzles.js`
- Standalone module (not loaded in main app)
- Contains pattern generators (10 types)
- Exports `window.samplePuzzleGenerator`

## Branch Naming Convention

Use prefixes for pull requests:
- `feat/` — New features
- `fix/` — Bug fixes  
- `docs/` — Documentation only
- `refactor/` — Code restructuring (no behavior change)

## Code Style

- **ES6 classes** with constructor and methods
- **No external dependencies** — keep it that way unless essential
- **Comment sparingly** — only where intent is non-obvious
- **Semicolons** — used consistently
- **camelCase** for variables/functions, **PascalCase** for classes

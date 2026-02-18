# Nonograms Quick Reference

## 🎯 Quick Start (60 seconds)

1. Open `load-sample-puzzles.html` → Click "Generate 100 Sample Puzzles"
2. Open `index.html` → Register (any username/password)
3. Go to "Browse Puzzles" → Pick any puzzle → Play!

## 🎮 How to Play

**Goal**: Fill cells to match the row and column clues

**Controls**:
- **Left-click** = Fill cell
- **Right-click** (or Shift+click) = Mark as empty (X)
- **Check Solution** = Verify your answer
- **Reset** = Clear all progress

**Clues**: Numbers show consecutive filled cells in that row/column
- Example: "3 1 2" = 3 filled, gap, 1 filled, gap, 2 filled

## 📋 Main Features

### Browse Puzzles
- View all available puzzles
- Filter by grid size (5×5 to 50×50)
- Click any card to play

### Create Puzzle
1. Enter name and select size
2. Click "Create Grid"
3. Click cells to toggle on/off
4. Click "Save Puzzle"

### From Photo
1. Upload an image
2. Adjust threshold slider
3. Select grid size
4. Click "Generate Puzzle"
5. Puzzle is saved automatically

### Solve Puzzle
1. Enter grid dimensions (e.g., 5 rows, 5 columns)
2. Click "Generate Clue Fields"
3. Enter row clues (e.g., "3,1,2" or "0")
4. Enter column clues (e.g., "2,1" or "0")
5. Click "Solve Puzzle"
6. Optionally save the solution

## 📚 Sample Puzzles

**100 puzzles included** (10 of each type):
- ☑️ Checkerboard
- 🖼️ Frame
- ↘️ Diagonal
- ↙️ Anti-Diagonal
- ✚ Cross
- 💎 Diamond
- ⭕ Circle
- ▦ Vertical Stripes
- ⛶ Four Corners
- 🎲 Random Pattern

**Sizes**: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50

## 💡 Tips & Tricks

### Playing Puzzles
1. Start with rows/columns that have large numbers
2. Look for rows/columns that are "full" (numbers add up to size)
3. Mark definite empty cells with right-click
4. Work back and forth between rows and columns
5. Look for overlaps when numbers are large

### Using the Solver
1. Enter "0" for empty rows/columns
2. Separate numbers with commas: "3,1,2"
3. No spaces needed
4. Start with smaller grids (5×5) to learn
5. The solver shows yellow for unknown cells

### Creating Puzzles
1. Simple patterns work best for small grids
2. Avoid too much randomness - make it solvable!
3. Test your puzzle before sharing
4. Symmetric patterns are visually appealing

## 🔧 Utilities

### Load Sample Puzzles
**File**: `load-sample-puzzles.html`
- Generates 100 puzzles instantly
- Can regenerate anytime
- Has "Clear All" option

### Test Solver
**File**: `test-solver.html`
- Runs 6 automated tests
- Shows solver performance
- Visual pass/fail indicators

## 🌟 Example Puzzles to Try

### Beginner (5×5 Cross)
```
Rows: 0, 1, 3, 1, 0
Cols: 0, 1, 3, 1, 0

Solution:
· · · · ·
· · █ · ·
· █ █ █ ·
· · █ · ·
· · · · ·
```

### Intermediate (5×5 Heart)
```
Rows: 2, 3, 5, 3, 1
Cols: 1, 3, 5, 3, 1

Solution:
█ · · · █
█ █ · █ █
█ █ █ █ █
· █ █ █ ·
· · █ · ·
```

### Advanced (10×10 Smiley)
Use the solver to solve this one!
```
Rows: 0, 1,1, 1,1, 0, 0, 1,1, 1,1, 0, 3, 0
Cols: 0, 3, 1,1, 1, 0, 0, 1, 1,1, 3, 0
```

## ❓ Troubleshooting

**Q: No puzzles showing?**
A: Load `load-sample-puzzles.html` first

**Q: Solver shows yellow cells?**
A: Puzzle requires guessing - try simpler puzzles

**Q: Lost my puzzles?**
A: They're in localStorage - don't clear browser data

**Q: Camera not working?**
A: Need HTTPS or localhost (file:// won't work)

**Q: Forgot password?**
A: Clear localStorage and re-register (demo app only)

## 🎨 Grid Size Guide

| Size | Difficulty | Time | Best For |
|------|-----------|------|----------|
| 5×5 | Easy | 1-2 min | Learning |
| 10×10 | Medium | 5-10 min | Quick game |
| 15×15 | Medium | 10-15 min | Standard |
| 20×20 | Hard | 20-30 min | Challenge |
| 25×25+ | Expert | 30+ min | Dedication |

## 🚀 Keyboard Shortcuts

- **Tab** = Next input field (solver)
- **Enter** = Submit form
- **Escape** = Close dialogs (future feature)
- **Ctrl+Z** = Undo (future feature)

## 📱 Mobile Support

- ✅ Touch to fill cells
- ✅ Long-press for empty mark (future)
- ✅ Responsive layout
- ✅ Zoom supported

## 🔗 Files Overview

- `index.html` - Main app
- `load-sample-puzzles.html` - Puzzle generator
- `test-solver.html` - Test suite
- `generate-sample-puzzles.js` - Console script

## 📖 Learn More

Check `README.md` for:
- Architecture details
- Contributing guide
- Full feature list
- Development notes

---

**Enjoy solving! 🎉**

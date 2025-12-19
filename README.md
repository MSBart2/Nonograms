# Nonograms - Picture Crossword Puzzles

A modern, beautiful web application for creating, sharing, and solving Nonogram puzzles (also known as picture crossword puzzles, griddlers, or paint by numbers).

## Features

### 🎨 Create Puzzles
- **Manual Creation**: Design puzzles by specifying size (5x5, 10x10, 15x15, 20x20) and clicking cells to create patterns
- **Photo Upload**: Generate puzzles automatically from uploaded images
- **Intuitive Editor**: Easy-to-use grid editor with clear/save functionality

### 📋 Browse & Play
- **Puzzle Library**: View all created puzzles in a beautiful grid layout
- **Filter by Size**: Quickly find puzzles by their dimensions
- **Interactive Gameplay**: Click to mark cells, right-click (or Shift+click) to mark cells as empty
- **Solution Checking**: Verify your solution at any time
- **Reset Option**: Start over if needed

### 🔍 Solve Existing Puzzles
- **Screenshot Upload**: Upload a screenshot of an existing puzzle to solve it
- **Camera Integration**: Use your device's camera to capture puzzles in real-time
- **Auto-Detection**: Automatically processes and solves uploaded puzzles

### 🔐 User Authentication
- **Local Authentication**: Simple username/password system using browser storage
- **User Registration**: Create an account to start creating and saving puzzles
- **Session Management**: Stay logged in across page refreshes

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Storage**: LocalStorage for user data and puzzles
- **Design**: Modern, responsive UI with smooth animations
- **Static**: No backend required - fully client-side application

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MSBart2/Nonograms.git
cd Nonograms
```

2. Open the application:
   - Simply open `index.html` in a modern web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Access the application:
   - Open your browser to `http://localhost:8000` (if using a server)
   - Or directly open `index.html`

### First Time Use

1. **Register an Account**:
   - Enter a username (minimum 3 characters)
   - Enter a password (minimum 6 characters)
   - Click "Register"

2. **Create Your First Puzzle**:
   - Click "Create Puzzle" in the sidebar
   - Enter a puzzle name and select size
   - Click "Create Grid" and start designing
   - Click cells to toggle them on/off
   - Click "Save Puzzle" when done

3. **Play Puzzles**:
   - Click "Browse Puzzles" to see all available puzzles
   - Click any puzzle card to start playing
   - Left-click cells to mark them as filled
   - Right-click (or Shift+click) to mark them as empty
   - Click "Check Solution" to verify your answer

## How to Play Nonograms

Nonograms are logic puzzles where you fill in cells in a grid to reveal a hidden picture. The numbers on the sides and top of the grid tell you how many consecutive cells are filled in each row and column.

**Example**:
- A clue "3 1" means there's a group of 3 filled cells, then at least one empty cell, then 1 filled cell
- A clue "5" means there are 5 consecutive filled cells
- A clue "0" means the entire row/column is empty

**Tips**:
1. Start with rows/columns that have large numbers
2. Look for rows/columns where the numbers add up to the total size
3. Mark cells you know are empty with right-click
4. Use logic - if you know cells are filled, count forward/backward from the clues

## Project Structure

```
Nonograms/
├── index.html          # Main application page
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   ├── app.js          # Main application logic and UI management
│   ├── auth.js         # Authentication and user management
│   ├── storage.js      # LocalStorage data management
│   ├── nonogram.js     # Puzzle game logic and rendering
│   ├── photoProcessor.js  # Image to puzzle conversion
│   └── solver.js       # Puzzle solving algorithms
└── README.md           # This file
```

## Features in Detail

### Puzzle Creation
- Support for multiple grid sizes
- Real-time visual feedback while designing
- Preview of puzzles before playing
- Automatic clue generation

### Photo-to-Puzzle Conversion
- Upload any image file
- Automatically converts to black and white grid
- Adjustable threshold for image processing
- Maintains aspect ratio

### Puzzle Solver
- Basic constraint propagation algorithm
- Line-solving techniques
- Support for uploaded puzzle screenshots
- Camera integration for mobile devices

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Adaptive grid sizing
- Mobile-optimized controls

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported

**Note**: Camera features require HTTPS in production environments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Credits

Created with ❤️ for puzzle enthusiasts everywhere.

Nonograms (Picture Cross) were invented by Non Ishida and Tetsuya Nishio in Japan in the late 1980s.
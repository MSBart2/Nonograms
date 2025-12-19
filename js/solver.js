// Nonogram solver - Solve puzzles from screenshots using OCR and logic
class NonogramSolver {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    async solveFromImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    try {
                        // Extract grid from image
                        const { grid, size } = this.extractGridFromImage(img);
                        
                        // Solve the puzzle
                        const solution = this.solvePuzzle(grid, size);
                        
                        resolve({ grid, solution, size });
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    extractGridFromImage(img) {
        // Simplified grid extraction - in a real app, this would use more sophisticated image processing
        // For now, we'll convert to a grid similar to photo processing
        const estimatedSize = 10; // Default size
        
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);

        // Create a simple grid from the image
        const grid = [];
        for (let i = 0; i < estimatedSize; i++) {
            grid.push(Array(estimatedSize).fill(0));
        }

        return { grid, size: estimatedSize };
    }

    solvePuzzle(clues, size) {
        // Basic line-solving algorithm for nonograms
        const solution = Array(size).fill(null).map(() => Array(size).fill(0));
        
        // This is a simplified solver
        // A complete solver would use constraint propagation and backtracking
        
        return solution;
    }

    // Line solving helper - determines which cells must be filled
    solveLine(clues, lineLength) {
        // Initialize all cells as unknown (-1: unknown, 0: empty, 1: filled)
        const line = Array(lineLength).fill(-1);
        
        if (clues.length === 1 && clues[0] === 0) {
            return Array(lineLength).fill(0);
        }

        // Calculate minimum space needed
        const minSpace = clues.reduce((sum, clue) => sum + clue, 0) + (clues.length - 1);
        
        if (minSpace === lineLength) {
            // Perfect fit - fill according to clues
            let pos = 0;
            for (let i = 0; i < clues.length; i++) {
                for (let j = 0; j < clues[i]; j++) {
                    line[pos++] = 1;
                }
                if (i < clues.length - 1) {
                    line[pos++] = 0;
                }
            }
            return line;
        }

        // Try all possible positions and find overlapping cells
        const possibilities = this.generateLinePossibilities(clues, lineLength);
        
        for (let i = 0; i < lineLength; i++) {
            const values = possibilities.map(p => p[i]);
            if (values.every(v => v === 1)) {
                line[i] = 1;
            } else if (values.every(v => v === 0)) {
                line[i] = 0;
            }
        }

        return line;
    }

    generateLinePossibilities(clues, length) {
        const possibilities = [];
        
        const generate = (clueIndex, startPos, current) => {
            if (clueIndex === clues.length) {
                // Fill remaining with zeros
                possibilities.push([...current, ...Array(length - current.length).fill(0)]);
                return;
            }

            const clue = clues[clueIndex];
            const remainingClues = clues.slice(clueIndex + 1);
            const minRemainingSpace = remainingClues.reduce((sum, c) => sum + c + 1, 0);
            
            // Try each possible position for this clue
            for (let pos = startPos; pos <= length - clue - minRemainingSpace; pos++) {
                const newCurrent = [
                    ...current,
                    ...Array(pos - current.length).fill(0),
                    ...Array(clue).fill(1)
                ];
                
                if (clueIndex < clues.length - 1) {
                    newCurrent.push(0); // At least one space between clues
                }
                
                generate(clueIndex + 1, newCurrent.length, newCurrent);
            }
        };

        generate(0, 0, []);
        return possibilities;
    }

    // Solve a complete puzzle using constraint propagation
    solveComplete(rowClues, colClues) {
        const rows = rowClues.length;
        const cols = colClues.length;
        const grid = Array(rows).fill(null).map(() => Array(cols).fill(-1));

        let changed = true;
        let iterations = 0;
        const maxIterations = 100;

        while (changed && iterations < maxIterations) {
            changed = false;
            iterations++;

            // Solve each row
            for (let i = 0; i < rows; i++) {
                const currentLine = grid[i];
                const solvedLine = this.solveLineWithKnown(rowClues[i], currentLine);
                
                for (let j = 0; j < cols; j++) {
                    if (grid[i][j] === -1 && solvedLine[j] !== -1) {
                        grid[i][j] = solvedLine[j];
                        changed = true;
                    }
                }
            }

            // Solve each column
            for (let j = 0; j < cols; j++) {
                const currentLine = grid.map(row => row[j]);
                const solvedLine = this.solveLineWithKnown(colClues[j], currentLine);
                
                for (let i = 0; i < rows; i++) {
                    if (grid[i][j] === -1 && solvedLine[i] !== -1) {
                        grid[i][j] = solvedLine[i];
                        changed = true;
                    }
                }
            }
        }

        return grid;
    }

    solveLineWithKnown(clues, knownLine) {
        const length = knownLine.length;
        const possibilities = this.generateLinePossibilities(clues, length);
        
        // Filter possibilities that match known cells
        const validPossibilities = possibilities.filter(possibility => {
            return knownLine.every((cell, i) => {
                return cell === -1 || cell === possibility[i];
            });
        });

        // Find cells that are the same in all valid possibilities
        const result = [...knownLine];
        for (let i = 0; i < length; i++) {
            if (result[i] === -1) {
                const values = validPossibilities.map(p => p[i]);
                if (values.length > 0 && values.every(v => v === values[0])) {
                    result[i] = values[0];
                }
            }
        }

        return result;
    }
}

// Make available globally
window.nonogramSolver = new NonogramSolver();

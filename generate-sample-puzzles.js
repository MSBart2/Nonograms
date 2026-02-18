// Sample puzzle generator - Creates 10 puzzles for each supported grid size
// Run this in the browser console after logging in to populate the app with sample puzzles

function generateSamplePuzzles() {
    const gridSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const patterns = {
        // Pattern generators for different types of puzzles
        checkerboard: (size) => {
            const grid = [];
            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    row.push((i + j) % 2);
                }
                grid.push(row);
            }
            return grid;
        },
        
        border: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            for (let i = 0; i < size; i++) {
                grid[0][i] = 1;
                grid[size-1][i] = 1;
                grid[i][0] = 1;
                grid[i][size-1] = 1;
            }
            return grid;
        },
        
        diagonal: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            for (let i = 0; i < size; i++) {
                grid[i][i] = 1;
            }
            return grid;
        },
        
        antiDiagonal: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            for (let i = 0; i < size; i++) {
                grid[i][size - 1 - i] = 1;
            }
            return grid;
        },
        
        cross: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            const mid = Math.floor(size / 2);
            for (let i = 0; i < size; i++) {
                grid[mid][i] = 1;
                grid[i][mid] = 1;
            }
            return grid;
        },
        
        diamond: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            const mid = Math.floor(size / 2);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (Math.abs(i - mid) + Math.abs(j - mid) <= mid) {
                        grid[i][j] = 1;
                    }
                }
            }
            return grid;
        },
        
        circle: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            const mid = size / 2;
            const radius = size / 2 - 1;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const dist = Math.sqrt((i - mid + 0.5) ** 2 + (j - mid + 0.5) ** 2);
                    if (dist <= radius) {
                        grid[i][j] = 1;
                    }
                }
            }
            return grid;
        },
        
        stripes: (size, vertical = true) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (vertical) {
                        grid[i][j] = j % 2;
                    } else {
                        grid[i][j] = i % 2;
                    }
                }
            }
            return grid;
        },
        
        corners: (size) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            const cornerSize = Math.floor(size / 3);
            for (let i = 0; i < cornerSize; i++) {
                for (let j = 0; j < cornerSize; j++) {
                    grid[i][j] = 1;
                    grid[i][size - 1 - j] = 1;
                    grid[size - 1 - i][j] = 1;
                    grid[size - 1 - i][size - 1 - j] = 1;
                }
            }
            return grid;
        },
        
        random: (size, density = 0.5) => {
            const grid = Array(size).fill(null).map(() => Array(size).fill(0));
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    grid[i][j] = Math.random() < density ? 1 : 0;
                }
            }
            return grid;
        }
    };

    const puzzleTemplates = [
        { pattern: 'checkerboard', name: 'Checkerboard' },
        { pattern: 'border', name: 'Frame' },
        { pattern: 'diagonal', name: 'Diagonal' },
        { pattern: 'antiDiagonal', name: 'Anti-Diagonal' },
        { pattern: 'cross', name: 'Cross' },
        { pattern: 'diamond', name: 'Diamond' },
        { pattern: 'circle', name: 'Circle' },
        { pattern: 'stripes', name: 'Vertical Stripes', args: [true] },
        { pattern: 'corners', name: 'Four Corners' },
        { pattern: 'random', name: 'Random Pattern', args: [0.4] }
    ];

    let totalCreated = 0;

    gridSizes.forEach(size => {
        puzzleTemplates.forEach((template, index) => {
            const args = template.args || [];
            const grid = patterns[template.pattern](size, ...args);
            
            const puzzle = {
                name: `${template.name} ${size}×${size}`,
                size: size,
                grid: grid
            };

            try {
                window.storageManager.savePuzzle(puzzle);
                totalCreated++;
                console.log(`✓ Created: ${puzzle.name}`);
            } catch (error) {
                console.error(`✗ Failed to create ${puzzle.name}:`, error);
            }
        });
    });

    console.log(`\n🎉 Created ${totalCreated} sample puzzles!`);
    console.log('Reload the page to see them in Browse Puzzles.');
    
    return totalCreated;
}

// Run the generator
generateSamplePuzzles();

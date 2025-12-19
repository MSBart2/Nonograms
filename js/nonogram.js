// Nonogram puzzle logic and rendering
class NonogramGame {
    constructor(size, grid = null) {
        this.size = size;
        this.grid = grid || this.createEmptyGrid();
        this.userGrid = this.createEmptyGrid();
    }

    createEmptyGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    }

    calculateClues() {
        const rowClues = [];
        const colClues = [];

        // Calculate row clues
        for (let i = 0; i < this.size; i++) {
            const clue = [];
            let count = 0;
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            rowClues.push(clue.length > 0 ? clue : [0]);
        }

        // Calculate column clues
        for (let j = 0; j < this.size; j++) {
            const clue = [];
            let count = 0;
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            colClues.push(clue.length > 0 ? clue : [0]);
        }

        return { rowClues, colClues };
    }

    renderEditor(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const gridElement = document.createElement('div');
        gridElement.className = 'editor-grid';
        gridElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        const cellSize = Math.min(30, Math.floor(400 / this.size));
        gridElement.style.width = `${cellSize * this.size}px`;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'editor-cell';
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                
                if (this.grid[i][j] === 1) {
                    cell.classList.add('filled');
                }

                cell.addEventListener('click', () => {
                    this.grid[i][j] = this.grid[i][j] === 1 ? 0 : 1;
                    cell.classList.toggle('filled');
                });

                gridElement.appendChild(cell);
            }
        }

        container.appendChild(gridElement);
    }

    renderGame(containerId, showSolution = false) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const { rowClues, colClues } = this.calculateClues();

        // Calculate max clue lengths for layout
        const maxRowClueLength = Math.max(...rowClues.map(c => c.length));
        const maxColClueLength = Math.max(...colClues.map(c => c.length));

        const gridElement = document.createElement('div');
        gridElement.className = 'game-grid';
        
        const cellSize = Math.min(35, Math.floor(500 / (this.size + maxRowClueLength)));
        
        gridElement.style.gridTemplateColumns = `repeat(${maxRowClueLength}, ${cellSize}px) repeat(${this.size}, ${cellSize}px)`;
        gridElement.style.gap = '1px';
        gridElement.style.background = '#e2e8f0';
        gridElement.style.padding = '1px';

        // Top-left corner (empty space)
        for (let i = 0; i < maxColClueLength; i++) {
            for (let j = 0; j < maxRowClueLength; j++) {
                const emptyCell = document.createElement('div');
                emptyCell.style.width = `${cellSize}px`;
                emptyCell.style.height = `${cellSize}px`;
                emptyCell.style.background = '#f8fafc';
                gridElement.appendChild(emptyCell);
            }
        }

        // Column clues (top)
        for (let i = 0; i < maxColClueLength; i++) {
            for (let j = 0; j < this.size; j++) {
                const clueCell = document.createElement('div');
                clueCell.className = 'clue-number';
                clueCell.style.width = `${cellSize}px`;
                clueCell.style.height = `${cellSize}px`;
                clueCell.style.background = '#f8fafc';
                clueCell.style.display = 'flex';
                clueCell.style.alignItems = 'center';
                clueCell.style.justifyContent = 'center';
                
                const clueIndex = i - (maxColClueLength - colClues[j].length);
                if (clueIndex >= 0) {
                    clueCell.textContent = colClues[j][clueIndex];
                }
                
                gridElement.appendChild(clueCell);
            }
        }

        // Game grid with row clues
        for (let i = 0; i < this.size; i++) {
            // Row clues (left)
            for (let k = 0; k < maxRowClueLength; k++) {
                const clueCell = document.createElement('div');
                clueCell.className = 'clue-number';
                clueCell.style.width = `${cellSize}px`;
                clueCell.style.height = `${cellSize}px`;
                clueCell.style.background = '#f8fafc';
                clueCell.style.display = 'flex';
                clueCell.style.alignItems = 'center';
                clueCell.style.justifyContent = 'center';
                
                const clueIndex = k - (maxRowClueLength - rowClues[i].length);
                if (clueIndex >= 0) {
                    clueCell.textContent = rowClues[i][clueIndex];
                }
                
                gridElement.appendChild(clueCell);
            }

            // Puzzle cells
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (showSolution && this.grid[i][j] === 1) {
                    cell.classList.add('marked');
                } else if (this.userGrid[i][j] === 1) {
                    cell.classList.add('marked');
                } else if (this.userGrid[i][j] === -1) {
                    cell.classList.add('crossed');
                }

                if (!showSolution) {
                    cell.addEventListener('click', (e) => {
                        if (e.shiftKey) {
                            // Right click or shift+click for cross
                            this.userGrid[i][j] = this.userGrid[i][j] === -1 ? 0 : -1;
                        } else {
                            // Left click for mark
                            this.userGrid[i][j] = this.userGrid[i][j] === 1 ? 0 : 1;
                        }
                        this.renderGame(containerId, showSolution);
                    });

                    cell.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        this.userGrid[i][j] = this.userGrid[i][j] === -1 ? 0 : -1;
                        this.renderGame(containerId, showSolution);
                    });
                }

                gridElement.appendChild(cell);
            }
        }

        container.appendChild(gridElement);
    }

    checkSolution() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 1 && this.userGrid[i][j] !== 1) {
                    return false;
                }
                if (this.grid[i][j] === 0 && this.userGrid[i][j] === 1) {
                    return false;
                }
            }
        }
        return true;
    }

    reset() {
        this.userGrid = this.createEmptyGrid();
    }

    getGrid() {
        return this.grid;
    }
}

// Make available globally
window.NonogramGame = NonogramGame;

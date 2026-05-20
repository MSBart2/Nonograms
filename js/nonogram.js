// Nonogram puzzle logic and rendering
class NonogramGame {
    constructor(size, grid = null) {
        this.size = size;
        this.grid = grid || this.createEmptyGrid();
        this.userGrid = this.createEmptyGrid();
        this.focusedRow = 0;
        this.focusedCol = 0;
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
        
        const cellSize = Math.max(6, Math.min(30, Math.floor(500 / this.size)));
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
        gridElement.setAttribute('role', 'grid');
        gridElement.setAttribute('aria-label', `Nonogram puzzle, ${this.size} by ${this.size}`);
        
        const cellSize = Math.max(6, Math.min(35, Math.floor(700 / (this.size + maxRowClueLength))));
        // Scale clue font size proportionally to cell size for readability on large grids
        const clueFontSize = Math.max(0.45, Math.min(0.8, cellSize / 18));
        
        gridElement.style.gridTemplateColumns = `repeat(${maxRowClueLength}, ${cellSize}px) repeat(${this.size}, ${cellSize}px)`;
        gridElement.style.gap = '1px';
        gridElement.style.background = '#e2e8f0';
        gridElement.style.padding = '1px';
        gridElement.style.overflowX = 'auto';

        // Top-left corner (empty space)
        for (let i = 0; i < maxColClueLength; i++) {
            for (let j = 0; j < maxRowClueLength; j++) {
                const emptyCell = document.createElement('div');
                emptyCell.style.width = `${cellSize}px`;
                emptyCell.style.height = `${cellSize}px`;
                emptyCell.style.background = '#f8fafc';
                emptyCell.setAttribute('role', 'presentation');
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
                clueCell.style.fontSize = `${clueFontSize}rem`;
                clueCell.setAttribute('role', 'columnheader');
                
                const clueIndex = i - (maxColClueLength - colClues[j].length);
                if (clueIndex >= 0) {
                    clueCell.textContent = colClues[j][clueIndex];
                    // Only add aria-label on the last row of column header cells (the full clue)
                    if (i === maxColClueLength - 1) {
                        clueCell.setAttribute('aria-label', `Column ${j + 1} clues: ${colClues[j].join(', ')}`);
                    }
                } else {
                    clueCell.setAttribute('aria-hidden', 'true');
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
                clueCell.style.fontSize = `${clueFontSize}rem`;
                clueCell.setAttribute('role', 'rowheader');
                
                const clueIndex = k - (maxRowClueLength - rowClues[i].length);
                if (clueIndex >= 0) {
                    clueCell.textContent = rowClues[i][clueIndex];
                    // Only add aria-label on the last (rightmost) row header cell
                    if (k === maxRowClueLength - 1) {
                        clueCell.setAttribute('aria-label', `Row ${i + 1} clues: ${rowClues[i].join(', ')}`);
                    }
                } else {
                    clueCell.setAttribute('aria-hidden', 'true');
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
                cell.setAttribute('role', 'gridcell');
                // Roving tabindex: focused cell gets 0, rest get -1
                cell.setAttribute('tabindex', (i === this.focusedRow && j === this.focusedCol) ? '0' : '-1');
                cell.setAttribute('aria-label', this._getCellAriaLabel(i, j, this.userGrid[i][j], rowClues, colClues));

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
                            this.userGrid[i][j] = this.userGrid[i][j] === -1 ? 0 : -1;
                        } else {
                            this.userGrid[i][j] = this.userGrid[i][j] === 1 ? 0 : 1;
                        }
                        this._updateCellInPlace(cell, i, j, rowClues, colClues);
                    });

                    cell.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        this.userGrid[i][j] = this.userGrid[i][j] === -1 ? 0 : -1;
                        this._updateCellInPlace(cell, i, j, rowClues, colClues);
                    });

                    cell.addEventListener('focus', () => {
                        this._moveFocus(gridElement, i, j, this.size);
                    });

                    cell.addEventListener('keydown', (e) => {
                        switch (e.key) {
                            case 'ArrowRight':
                                e.preventDefault();
                                if (this.focusedCol < this.size - 1) {
                                    this._moveFocus(gridElement, this.focusedRow, this.focusedCol + 1, this.size);
                                }
                                break;
                            case 'ArrowLeft':
                                e.preventDefault();
                                if (this.focusedCol > 0) {
                                    this._moveFocus(gridElement, this.focusedRow, this.focusedCol - 1, this.size);
                                }
                                break;
                            case 'ArrowDown':
                                e.preventDefault();
                                if (this.focusedRow < this.size - 1) {
                                    this._moveFocus(gridElement, this.focusedRow + 1, this.focusedCol, this.size);
                                }
                                break;
                            case 'ArrowUp':
                                e.preventDefault();
                                if (this.focusedRow > 0) {
                                    this._moveFocus(gridElement, this.focusedRow - 1, this.focusedCol, this.size);
                                }
                                break;
                            case ' ':
                                e.preventDefault();
                                this.userGrid[i][j] = this.userGrid[i][j] === 1 ? 0 : 1;
                                this._updateCellInPlace(cell, i, j, rowClues, colClues);
                                break;
                            case 'x':
                            case 'X':
                            case 'Delete':
                            case 'Backspace':
                                e.preventDefault();
                                if (e.key === 'x' || e.key === 'X') {
                                    this.userGrid[i][j] = this.userGrid[i][j] === -1 ? 0 : -1;
                                } else {
                                    // Delete/Backspace clears the cell
                                    this.userGrid[i][j] = 0;
                                }
                                this._updateCellInPlace(cell, i, j, rowClues, colClues);
                                break;
                        }
                    });
                }

                gridElement.appendChild(cell);
            }
        }

        container.appendChild(gridElement);
    }

    // --- Private helpers ---

    _getStateLabel(val) {
        if (val === 1) return 'filled';
        if (val === -1) return 'crossed';
        return 'empty';
    }

    _getCellAriaLabel(i, j, stateValue, rowClues, colClues) {
        const state = this._getStateLabel(stateValue);
        const rClues = rowClues[i].join(', ');
        const cClues = colClues[j].join(', ');
        return `Row ${i + 1}, Column ${j + 1}, ${state}, row clues ${rClues}, column clues ${cClues}`;
    }

    _moveFocus(gridElement, newRow, newCol, size) {
        // Remove tabindex=0 from the currently focused cell
        const oldCell = gridElement.querySelector(`[data-row="${this.focusedRow}"][data-col="${this.focusedCol}"]`);
        if (oldCell) oldCell.setAttribute('tabindex', '-1');

        this.focusedRow = newRow;
        this.focusedCol = newCol;

        // Give tabindex=0 to the new focused cell and focus it
        const newCell = gridElement.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (newCell) {
            newCell.setAttribute('tabindex', '0');
            newCell.focus();
        }
    }

    _updateCellInPlace(cell, i, j, rowClues, colClues) {
        const val = this.userGrid[i][j];
        // Update CSS classes
        cell.classList.remove('marked', 'crossed');
        if (val === 1) {
            cell.classList.add('marked');
        } else if (val === -1) {
            cell.classList.add('crossed');
        }
        // Update aria-label to reflect new state
        cell.setAttribute('aria-label', this._getCellAriaLabel(i, j, val, rowClues, colClues));
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

// Storage module for puzzle data management
class StorageManager {
    constructor() {
        this.storageKey = 'nonogram_puzzles';
    }

    getAllPuzzles() {
        const puzzles = localStorage.getItem(this.storageKey);
        return puzzles ? JSON.parse(puzzles) : [];
    }

    savePuzzle(puzzle) {
        const puzzles = this.getAllPuzzles();
        
        // Generate unique ID
        puzzle.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        puzzle.createdAt = new Date().toISOString();
        puzzle.createdBy = window.authManager.getCurrentUser();
        
        puzzles.push(puzzle);
        localStorage.setItem(this.storageKey, JSON.stringify(puzzles));
        
        return puzzle.id;
    }

    getPuzzle(id) {
        const puzzles = this.getAllPuzzles();
        return puzzles.find(p => p.id === id);
    }

    getPuzzlesBySize(size) {
        const puzzles = this.getAllPuzzles();
        if (size === 'all') {
            return puzzles;
        }
        return puzzles.filter(p => p.size === parseInt(size));
    }

    updatePuzzle(id, updates) {
        const puzzles = this.getAllPuzzles();
        const index = puzzles.findIndex(p => p.id === id);
        
        if (index !== -1) {
            puzzles[index] = { ...puzzles[index], ...updates };
            localStorage.setItem(this.storageKey, JSON.stringify(puzzles));
            return true;
        }
        
        return false;
    }

    deletePuzzle(id) {
        const puzzles = this.getAllPuzzles();
        const filtered = puzzles.filter(p => p.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return true;
    }
}

// Create global storage manager instance
window.storageManager = new StorageManager();

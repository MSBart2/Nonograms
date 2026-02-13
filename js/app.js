// Main application logic
class NonogramApp {
    constructor() {
        this.currentView = 'browse';
        this.currentGame = null;
        this.cameraStream = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        if (window.authManager.isLoggedIn()) {
            this.showMainScreen();
        } else {
            this.showLoginScreen();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register button
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Create puzzle form
        const createForm = document.getElementById('createPuzzleForm');
        if (createForm) {
            createForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startPuzzleCreation();
            });
        }

        // Save puzzle button
        const saveBtn = document.getElementById('savePuzzle');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePuzzle();
            });
        }

        // Clear grid button
        const clearBtn = document.getElementById('clearGrid');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearGrid();
            });
        }

        // Photo upload form
        const photoForm = document.getElementById('photoUploadForm');
        if (photoForm) {
            photoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPuzzleFromPhoto();
            });
        }

        // Photo upload preview
        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) {
            photoUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    document.getElementById('photoPreview').classList.remove('hidden');
                    window.photoProcessor.previewImage(e.target.files[0], 'photoCanvas');
                }
            });
        }

        // Threshold slider label update
        const thresholdSlider = document.getElementById('photoThreshold');
        if (thresholdSlider) {
            thresholdSlider.addEventListener('input', (e) => {
                document.getElementById('thresholdValue').textContent = e.target.value;
            });
        }

        // Size filter
        const sizeFilter = document.getElementById('sizeFilter');
        if (sizeFilter) {
            sizeFilter.addEventListener('change', () => {
                this.loadPuzzles();
            });
        }

        // Camera buttons
        const openCameraBtn = document.getElementById('openCamera');
        if (openCameraBtn) {
            openCameraBtn.addEventListener('click', () => {
                this.openCamera();
            });
        }

        const captureBtn = document.getElementById('capturePhoto');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                this.capturePhoto();
            });
        }

        // Screenshot upload
        const screenshotUpload = document.getElementById('puzzleScreenshot');
        if (screenshotUpload) {
            screenshotUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.solvePuzzleFromImage(e.target.files[0]);
                }
            });
        }

        // Game controls
        const checkBtn = document.getElementById('checkSolution');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                this.checkSolution();
            });
        }

        const resetBtn = document.getElementById('resetPuzzle');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetPuzzle();
            });
        }

        const backBtn = document.getElementById('backToBrowse');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.switchView('browse');
            });
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
    }

    showMainScreen() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        
        const username = window.authManager.getCurrentUser();
        document.getElementById('userDisplay').textContent = `👤 ${username}`;
        
        this.loadPuzzles();
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            window.authManager.login(username, password);
            this.showMainScreen();
            this.showNotification('Welcome back!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleRegister() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            window.authManager.register(username, password);
            window.authManager.login(username, password);
            this.showMainScreen();
            this.showNotification('Account created successfully!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleLogout() {
        window.authManager.logout();
        this.showLoginScreen();
        this.showNotification('Logged out successfully', 'info');
    }

    switchView(viewName) {
        // Update menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        document.getElementById(`${viewName}View`).classList.add('active');
        this.currentView = viewName;

        // Load data if needed
        if (viewName === 'browse') {
            this.loadPuzzles();
        }
    }

    loadPuzzles() {
        const sizeFilter = document.getElementById('sizeFilter').value;
        const puzzles = window.storageManager.getPuzzlesBySize(sizeFilter);
        const container = document.getElementById('puzzleList');

        if (puzzles.length === 0) {
            container.innerHTML = '<p class="help-text">No puzzles found. Create your first puzzle!</p>';
            return;
        }

        container.innerHTML = '';
        
        puzzles.forEach(puzzle => {
            const card = this.createPuzzleCard(puzzle);
            container.appendChild(card);
        });
    }

    createPuzzleCard(puzzle) {
        const card = document.createElement('div');
        card.className = 'puzzle-card';
        
        const title = document.createElement('h3');
        title.textContent = puzzle.name;
        
        const info = document.createElement('div');
        info.className = 'puzzle-info';
        info.innerHTML = `
            <span>📏 ${puzzle.size}x${puzzle.size}</span>
            <span>👤 ${puzzle.createdBy}</span>
        `;

        const preview = this.createMiniPreview(puzzle.grid);
        
        card.appendChild(title);
        card.appendChild(info);
        card.appendChild(preview);

        card.addEventListener('click', () => {
            this.playPuzzle(puzzle);
        });

        return card;
    }

    createMiniPreview(grid) {
        const preview = document.createElement('div');
        preview.className = 'puzzle-preview';
        preview.style.gridTemplateColumns = `repeat(${grid.length}, 1fr)`;

        const maxCells = 100; // Limit preview size
        if (grid.length * grid.length <= maxCells) {
            grid.forEach(row => {
                row.forEach(cell => {
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'puzzle-preview-cell';
                    if (cell === 1) {
                        cellDiv.classList.add('filled');
                    }
                    preview.appendChild(cellDiv);
                });
            });
        } else {
            // For large grids, show a scaled-down version
            const step = Math.ceil(grid.length / 10);
            for (let i = 0; i < grid.length; i += step) {
                for (let j = 0; j < grid.length; j += step) {
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'puzzle-preview-cell';
                    if (grid[i][j] === 1) {
                        cellDiv.classList.add('filled');
                    }
                    preview.appendChild(cellDiv);
                }
            }
            preview.style.gridTemplateColumns = `repeat(${Math.ceil(grid.length / step)}, 1fr)`;
        }

        return preview;
    }

    startPuzzleCreation() {
        const size = parseInt(document.getElementById('puzzleSize').value);
        this.currentGame = new NonogramGame(size);
        
        document.getElementById('gridEditor').classList.remove('hidden');
        this.currentGame.renderEditor('editorCanvas');
    }

    clearGrid() {
        if (this.currentGame) {
            const size = this.currentGame.size;
            this.currentGame = new NonogramGame(size);
            this.currentGame.renderEditor('editorCanvas');
        }
    }

    savePuzzle() {
        if (!this.currentGame) {
            this.showNotification('No puzzle to save', 'error');
            return;
        }

        const name = document.getElementById('puzzleName').value;
        const size = this.currentGame.size;
        const grid = this.currentGame.getGrid();

        const puzzle = {
            name,
            size,
            grid
        };

        window.storageManager.savePuzzle(puzzle);
        this.showNotification('Puzzle saved successfully!', 'success');
        
        // Reset form
        document.getElementById('createPuzzleForm').reset();
        document.getElementById('gridEditor').classList.add('hidden');
        this.currentGame = null;
    }

    async createPuzzleFromPhoto() {
        const name = document.getElementById('photoPuzzleName').value;
        const size = parseInt(document.getElementById('photoPuzzleSize').value);
        const threshold = parseInt(document.getElementById('photoThreshold').value) || 128;
        const fileInput = document.getElementById('photoUpload');

        if (fileInput.files.length === 0) {
            this.showNotification('Please select a photo', 'error');
            return;
        }

        try {
            this.showNotification('Processing image...', 'info');
            const grid = await window.photoProcessor.processImage(fileInput.files[0], size, threshold);

            const puzzle = {
                name,
                size,
                grid
            };

            window.storageManager.savePuzzle(puzzle);
            this.showNotification('Puzzle created from photo!', 'success');

            // Reset form
            document.getElementById('photoUploadForm').reset();
            document.getElementById('photoPreview').classList.add('hidden');
        } catch (error) {
            this.showNotification('Failed to process image: ' + error.message, 'error');
        }
    }

    async openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            this.cameraStream = stream;
            const video = document.getElementById('cameraPreview');
            video.srcObject = stream;
            video.classList.remove('hidden');
            document.getElementById('capturePhoto').classList.remove('hidden');
            document.getElementById('openCamera').classList.add('hidden');
        } catch (error) {
            this.showNotification('Could not access camera: ' + error.message, 'error');
        }
    }

    async capturePhoto() {
        const video = document.getElementById('cameraPreview');
        const canvas = document.getElementById('captureCanvas');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Stop camera
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
        }
        video.classList.add('hidden');
        document.getElementById('capturePhoto').classList.add('hidden');
        document.getElementById('openCamera').classList.remove('hidden');

        // Convert canvas to blob and process
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            await this.solvePuzzleFromImage(file);
        });
    }

    async solvePuzzleFromImage(file) {
        try {
            this.showNotification('Analyzing puzzle...', 'info');
            
            // For demonstration, we'll create a simple solution
            // In a real app, this would use OCR and image processing
            const grid = await window.photoProcessor.processImage(file, 10);
            const game = new NonogramGame(10, grid);
            
            const resultDiv = document.getElementById('solveResult');
            resultDiv.classList.remove('hidden');
            
            const solutionDiv = document.getElementById('solutionDisplay');
            solutionDiv.innerHTML = '<h4>Detected Puzzle Solution:</h4>';
            
            game.renderGame('solutionDisplay', true);
            
            this.showNotification('Puzzle analyzed!', 'success');
        } catch (error) {
            this.showNotification('Failed to solve puzzle: ' + error.message, 'error');
        }
    }

    playPuzzle(puzzle) {
        this.currentGame = new NonogramGame(puzzle.size, puzzle.grid);
        
        document.getElementById('currentPuzzleName').textContent = puzzle.name;
        this.switchView('play');
        
        this.currentGame.renderGame('gameCanvas');
    }

    checkSolution() {
        if (!this.currentGame) return;

        if (this.currentGame.checkSolution()) {
            this.showNotification('🎉 Congratulations! Puzzle solved correctly!', 'success');
            this.currentGame.renderGame('gameCanvas', true);
        } else {
            this.showNotification('Not quite right. Keep trying!', 'error');
        }
    }

    resetPuzzle() {
        if (this.currentGame) {
            this.currentGame.reset();
            this.currentGame.renderGame('gameCanvas');
            this.showNotification('Puzzle reset', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NonogramApp();
});

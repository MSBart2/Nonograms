// Photo processing module - Convert images to nonogram grids
class PhotoProcessor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    static get MAX_GRID_SIZE() {
        return 50;
    }

    async processImage(file, size, threshold = 128) {
        if (size < 1 || size > PhotoProcessor.MAX_GRID_SIZE) {
            throw new Error(`Grid size must be between 1 and ${PhotoProcessor.MAX_GRID_SIZE}`);
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    try {
                        const grid = this.imageToGrid(img, size, threshold);
                        resolve(grid);
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

    imageToGrid(img, size, threshold) {
        // Set canvas size
        this.canvas.width = size;
        this.canvas.height = size;

        // Draw image scaled to canvas size
        this.ctx.drawImage(img, 0, 0, size, size);

        // Get image data
        const imageData = this.ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        // Convert to grid (black and white)
        const grid = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const idx = (i * size + j) * 4;
                // Calculate grayscale value
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const gray = (r + g + b) / 3;
                
                // Apply threshold (darker pixels become 1, lighter become 0)
                row.push(gray < threshold ? 1 : 0);
            }
            grid.push(row);
        }

        return grid;
    }

    previewImage(file, canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = Math.min(400, img.width);
                canvas.height = (img.height * canvas.width) / img.width;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

// Make available globally
window.photoProcessor = new PhotoProcessor();

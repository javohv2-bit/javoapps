/**
 * historyManager.js
 * Manages the localStorage history for generated InPages.
 */

const STORAGE_KEY = 'inpage_history';

/**
 * Load history from localStorage
 * @returns {Array} Array of history items
 */
export const loadHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const history = JSON.parse(stored);

        // Deduplicate by SKU (keeping the most recent/first occurrence)
        const seenSkus = new Set();
        const uniqueHistory = history.filter(item => {
            if (seenSkus.has(item.sku)) return false;
            seenSkus.add(item.sku);
            return true;
        });

        return uniqueHistory;
    } catch (e) {
        console.error('Error loading history:', e);
        return [];
    }
};

/**
 * Save a new item to history
 * @param {string} sku - Product SKU
 * @param {Array} blocks - Editor blocks
 * @param {Object} imageMap - Map of blobs/urls (optional, for local images)
 * @param {string} name - Product Name (optional)
 * @param {string} imagePath - Base path for images (optional, for catalog items)
 * @returns {Object} The saved item
 */
export const saveToHistory = (sku, blocks, imageMap = {}, name = '', imagePath = null) => {
    try {
        const history = loadHistory();

        // Process blocks to remove non-serializable data (File objects)
        // but keep string paths for images
        const processedBlocks = blocks.map(block => {
            const processedData = { ...block.data };
            Object.keys(processedData).forEach(key => {
                if (processedData[key] instanceof File) {
                    // For File objects, we can't serialize them
                    // The image will need to be re-uploaded if editing again
                    delete processedData[key];
                }
            });
            return { ...block, data: processedData };
        });

        const newItem = {
            id: Date.now().toString(),
            sku,
            name: name || `Proyecto ${sku}`,
            createdAt: Date.now(),
            blocks: processedBlocks,
            imageMap: {}, // ImageMaps with blob URLs can't be persisted
            imagePath // Store the base path for catalog items
        };

        // Remove duplicates with same SKU (keep only the newest one)
        const filteredHistory = history.filter(item => item.sku !== sku);

        // Add to top
        filteredHistory.unshift(newItem);

        // Limit to 50 items
        if (filteredHistory.length > 50) {
            filteredHistory.pop();
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
        return newItem;
    } catch (e) {
        console.error('Error saving to history:', e);
        return null;
    }
};

/**
 * Delete an item from history
 * @param {string} id - Item ID
 * @returns {Array} New history array
 */
export const deleteHistoryItem = (id) => {
    try {
        const history = loadHistory();
        const newHistory = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
    } catch (e) {
        console.error('Error deleting history item:', e);
        return [];
    }
};

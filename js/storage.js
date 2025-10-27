/**
 * Local Storage Wrapper
 * Handles persistence of user data across sessions
 */

const STORAGE_KEY = 'thai-script-master';
const STORAGE_VERSION = 1;

class Storage {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
    }

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    /**
     * Get default data structure
     * @returns {object}
     */
    getDefaultData() {
        return {
            version: STORAGE_VERSION,
            deck: {
                cards: {},
                newCardsPerDay: 5,
                maxReviewsPerSession: 50
            },
            settings: {
                currentLevel: 1,
                unlockedLevels: [1],
                audioEnabled: false,
                autoPlay: false,
                volume: 80,
                playbackSpeed: 1.0,
                darkMode: false
            },
            stats: {
                sessionsCount: 0,
                totalTimeSpent: 0, // milliseconds
                dailyStats: {}, // date -> { reviews, correct, wrong, timeSpent }
                confusionMatrix: {} // character -> { character -> count }
            },
            session: {
                startTime: null,
                reviewsThisSession: 0,
                correctThisSession: 0,
                wrongThisSession: 0,
                currentStreak: 0,
                longestStreak: 0
            }
        };
    }

    /**
     * Load data from localStorage
     * @returns {object}
     */
    load() {
        if (!this.storageAvailable) {
            return this.getDefaultData();
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                return this.getDefaultData();
            }

            const data = JSON.parse(stored);

            // Check version and migrate if needed
            if (data.version !== STORAGE_VERSION) {
                return this.migrate(data);
            }

            return data;
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
            return this.getDefaultData();
        }
    }

    /**
     * Save data to localStorage
     * @param {object} data
     * @returns {boolean} - Success status
     */
    save(data) {
        if (!this.storageAvailable) {
            console.warn('Cannot save: localStorage not available');
            return false;
        }

        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(STORAGE_KEY, jsonData);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                this.handleQuotaExceeded();
            } else {
                console.error('Error saving to localStorage:', e);
            }
            return false;
        }
    }

    /**
     * Handle localStorage quota exceeded
     */
    handleQuotaExceeded() {
        alert('Storage limit reached. Consider exporting your data and clearing old sessions.');
        // Could implement automatic cleanup of old session data here
    }

    /**
     * Migrate data from older versions
     * @param {object} oldData
     * @returns {object}
     */
    migrate(oldData) {
        console.log(`Migrating data from version ${oldData.version} to ${STORAGE_VERSION}`);
        // Future: implement migration logic for version changes
        // For now, just merge with defaults
        const defaultData = this.getDefaultData();
        return { ...defaultData, ...oldData, version: STORAGE_VERSION };
    }

    /**
     * Export data as JSON string
     * @returns {string}
     */
    exportData() {
        const data = this.load();
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import data from JSON string
     * @param {string} jsonString
     * @returns {boolean} - Success status
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Validate basic structure
            if (!data.version || !data.deck || !data.settings) {
                throw new Error('Invalid data format');
            }

            // Migrate if needed
            const migratedData = data.version !== STORAGE_VERSION ? this.migrate(data) : data;

            return this.save(migratedData);
        } catch (e) {
            console.error('Error importing data:', e);
            alert('Invalid data format. Please check the file and try again.');
            return false;
        }
    }

    /**
     * Export data as downloadable file
     */
    downloadExport() {
        const data = this.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `thai-script-backup-${timestamp}.json`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Clear all data (reset progress)
     * @returns {boolean}
     */
    clearAll() {
        if (!this.storageAvailable) {
            return false;
        }

        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }

    /**
     * Get storage usage statistics
     * @returns {object}
     */
    getStorageStats() {
        if (!this.storageAvailable) {
            return { used: 0, total: 0, percentage: 0 };
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const used = stored ? new Blob([stored]).size : 0;
            const total = 5 * 1024 * 1024; // ~5MB typical localStorage limit
            const percentage = (used / total) * 100;

            return {
                used,
                total,
                percentage: percentage.toFixed(2),
                usedKB: (used / 1024).toFixed(2),
                totalKB: (total / 1024).toFixed(2)
            };
        } catch (e) {
            console.error('Error getting storage stats:', e);
            return { used: 0, total: 0, percentage: 0 };
        }
    }

    /**
     * Record confusion (wrong answer)
     * @param {string} shown - Character that was shown
     * @param {string} answered - Character user answered with
     * @param {object} data - Current data object
     */
    recordConfusion(shown, answered, data) {
        if (!data.stats.confusionMatrix[shown]) {
            data.stats.confusionMatrix[shown] = {};
        }
        if (!data.stats.confusionMatrix[shown][answered]) {
            data.stats.confusionMatrix[shown][answered] = 0;
        }
        data.stats.confusionMatrix[shown][answered]++;
    }

    /**
     * Get confusion pairs (characters frequently confused)
     * @param {object} data
     * @param {number} threshold - Minimum confusions to include
     * @returns {array}
     */
    getConfusionPairs(data, threshold = 3) {
        const pairs = [];

        Object.entries(data.stats.confusionMatrix).forEach(([shown, confusions]) => {
            Object.entries(confusions).forEach(([answered, count]) => {
                if (count >= threshold) {
                    pairs.push({ shown, answered, count });
                }
            });
        });

        // Sort by count (descending)
        return pairs.sort((a, b) => b.count - a.count);
    }

    /**
     * Record daily statistics
     * @param {object} data
     * @param {boolean} correct
     */
    recordDailyStats(data, correct) {
        const today = new Date().toISOString().split('T')[0];

        if (!data.stats.dailyStats[today]) {
            data.stats.dailyStats[today] = {
                reviews: 0,
                correct: 0,
                wrong: 0,
                timeSpent: 0
            };
        }

        data.stats.dailyStats[today].reviews++;
        if (correct) {
            data.stats.dailyStats[today].correct++;
        } else {
            data.stats.dailyStats[today].wrong++;
        }
    }

    /**
     * Get accuracy for a specific level
     * @param {object} data
     * @param {number} levelNumber
     * @returns {number} - Percentage (0-100)
     */
    getLevelAccuracy(data, levelNumber) {
        const levelChars = ThaiData.getLevelCharacters(levelNumber);
        let totalReviews = 0;
        let totalCorrect = 0;

        levelChars.forEach(char => {
            const card = data.deck.cards[char];
            if (card && card.totalReviews > 0) {
                totalReviews += card.totalReviews;
                totalCorrect += card.correctCount;
            }
        });

        return totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;
    }
}

// Create singleton instance
const storage = new Storage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage, storage };
}

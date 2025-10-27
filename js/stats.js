/**
 * Statistics and Analytics Module
 * Handles calculation and tracking of learning statistics
 */

class Stats {
    constructor() {
        this.sessionStartTime = null;
        this.sessionReviewTimes = []; // Array of response times for current session
    }

    /**
     * Start a new session
     */
    startSession() {
        this.sessionStartTime = Date.now();
        this.sessionReviewTimes = [];
    }

    /**
     * Get session duration in milliseconds
     * @returns {number}
     */
    getSessionDuration() {
        if (!this.sessionStartTime) return 0;
        return Date.now() - this.sessionStartTime;
    }

    /**
     * Get session duration in human-readable format
     * @returns {string}
     */
    getSessionDurationFormatted() {
        const ms = this.getSessionDuration();
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Record response time for current session
     * @param {number} time - Response time in milliseconds
     */
    recordResponseTime(time) {
        this.sessionReviewTimes.push(time);
    }

    /**
     * Get average response time for current session
     * @returns {number}
     */
    getAverageResponseTime() {
        if (this.sessionReviewTimes.length === 0) return 0;
        const sum = this.sessionReviewTimes.reduce((acc, time) => acc + time, 0);
        return sum / this.sessionReviewTimes.length;
    }

    /**
     * Calculate overall accuracy from data
     * @param {object} data - Storage data
     * @returns {number} - Percentage (0-100)
     */
    calculateOverallAccuracy(data) {
        const { totalCorrect, totalIncorrect } = this.getTotalStats(data);
        const total = totalCorrect + totalIncorrect;
        return total > 0 ? (totalCorrect / total) * 100 : 0;
    }

    /**
     * Calculate session accuracy
     * @param {object} data - Storage data
     * @returns {number} - Percentage (0-100)
     */
    calculateSessionAccuracy(data) {
        const correct = data.session.correctThisSession;
        const wrong = data.session.wrongThisSession;
        const total = correct + wrong;
        return total > 0 ? (correct / total) * 100 : 0;
    }

    /**
     * Get total statistics from all cards
     * @param {object} data - Storage data
     * @returns {object}
     */
    getTotalStats(data) {
        let totalReviews = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;
        let newCards = 0;
        let learningCards = 0;
        let matureCards = 0;

        Object.values(data.deck.cards).forEach(card => {
            totalReviews += card.totalReviews;
            totalCorrect += card.correctCount;
            totalIncorrect += card.incorrectCount;

            if (card.isNew) newCards++;
            else if (card.isLearning) learningCards++;
            else if (card.isMature) matureCards++;
        });

        return {
            totalReviews,
            totalCorrect,
            totalIncorrect,
            newCards,
            learningCards,
            matureCards
        };
    }

    /**
     * Get number of due cards
     * @param {object} data - Storage data
     * @returns {number}
     */
    getDueCardsCount(data) {
        const now = Date.now();
        return Object.values(data.deck.cards).filter(card =>
            card.nextReview <= now
        ).length;
    }

    /**
     * Get number of cards learned today
     * @param {object} data - Storage data
     * @returns {number}
     */
    getLearnedTodayCount(data) {
        const today = new Date().toISOString().split('T')[0];
        return data.stats.dailyStats[today]?.reviews || 0;
    }

    /**
     * Calculate quality grade based on correctness and response time
     * @param {boolean} correct - Whether answer was correct
     * @param {number} responseTime - Time in milliseconds
     * @returns {number} - Quality grade (0-5)
     */
    calculateQuality(correct, responseTime) {
        if (!correct) {
            // Wrong answer: grade 0-2 based on how wrong
            // For now, just return 1 (incorrect but familiar)
            return 1;
        }

        // Correct answer: grade 3-5 based on response time
        // Fast: < 3 seconds = 5 (perfect)
        // Medium: 3-6 seconds = 4 (good)
        // Slow: > 6 seconds = 3 (barely correct)
        const secondsToAnswer = responseTime / 1000;

        if (secondsToAnswer < 3) {
            return 5; // Perfect recall
        } else if (secondsToAnswer < 6) {
            return 4; // Good recall
        } else {
            return 3; // Correct but difficult
        }
    }

    /**
     * Get learning progress for current level
     * @param {object} data - Storage data
     * @returns {object}
     */
    getLevelProgress(data) {
        const currentLevel = data.settings.currentLevel;
        const levelChars = ThaiData.getLevelCharacters(currentLevel);

        let totalChars = levelChars.length;
        let reviewedChars = 0;
        let masteredChars = 0; // easeFactor >= 2.5

        levelChars.forEach(char => {
            const card = data.deck.cards[char];
            if (card && card.totalReviews > 0) {
                reviewedChars++;
                if (card.easeFactor >= 2.5 && card.repetitions >= 2) {
                    masteredChars++;
                }
            }
        });

        return {
            level: currentLevel,
            totalChars,
            reviewedChars,
            masteredChars,
            reviewedPercentage: (reviewedChars / totalChars) * 100,
            masteredPercentage: (masteredChars / totalChars) * 100
        };
    }

    /**
     * Check if level should be unlocked
     * @param {object} data - Storage data
     * @param {number} levelNumber - Level to check
     * @returns {boolean}
     */
    shouldUnlockLevel(data, levelNumber) {
        if (levelNumber <= 1) return true; // Level 1 always unlocked
        if (data.settings.unlockedLevels.includes(levelNumber)) return true; // Already unlocked

        const levelInfo = ThaiData.getLevelInfo(levelNumber);
        if (!levelInfo) return false;

        // Check if previous level has met accuracy threshold
        const previousLevelAccuracy = storage.getLevelAccuracy(data, levelNumber - 1);
        return previousLevelAccuracy >= (levelInfo.unlockThreshold * 100);
    }

    /**
     * Get daily statistics for the last N days
     * @param {object} data - Storage data
     * @param {number} days - Number of days to retrieve
     * @returns {array}
     */
    getDailyStatsHistory(data, days = 30) {
        const history = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayStats = data.stats.dailyStats[dateStr] || {
                reviews: 0,
                correct: 0,
                wrong: 0,
                timeSpent: 0
            };

            history.push({
                date: dateStr,
                ...dayStats,
                accuracy: dayStats.reviews > 0 ? (dayStats.correct / dayStats.reviews) * 100 : 0
            });
        }

        return history;
    }

    /**
     * Get top difficult characters (lowest ease factors)
     * @param {object} data - Storage data
     * @param {number} count - Number of characters to return
     * @returns {array}
     */
    getDifficultCharacters(data, count = 10) {
        const cards = Object.entries(data.deck.cards)
            .filter(([_, card]) => card.totalReviews > 0)
            .map(([char, card]) => ({
                character: char,
                easeFactor: card.easeFactor,
                accuracy: card.totalReviews > 0 ? (card.correctCount / card.totalReviews) * 100 : 0,
                totalReviews: card.totalReviews
            }))
            .sort((a, b) => a.easeFactor - b.easeFactor);

        return cards.slice(0, count);
    }

    /**
     * Get mastered characters (high ease factors)
     * @param {object} data - Storage data
     * @param {number} count - Number of characters to return
     * @returns {array}
     */
    getMasteredCharacters(data, count = 10) {
        const cards = Object.entries(data.deck.cards)
            .filter(([_, card]) => card.isMature && card.repetitions >= 3)
            .map(([char, card]) => ({
                character: char,
                easeFactor: card.easeFactor,
                accuracy: (card.correctCount / card.totalReviews) * 100,
                totalReviews: card.totalReviews,
                repetitions: card.repetitions
            }))
            .sort((a, b) => b.easeFactor - a.easeFactor);

        return cards.slice(0, count);
    }

    /**
     * Format time duration
     * @param {number} milliseconds
     * @returns {string}
     */
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Format large numbers with commas
     * @param {number} num
     * @returns {string}
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Format percentage
     * @param {number} value - Decimal percentage (0-100)
     * @param {number} decimals - Number of decimal places
     * @returns {string}
     */
    formatPercentage(value, decimals = 1) {
        return `${value.toFixed(decimals)}%`;
    }
}

// Create singleton instance
const stats = new Stats();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Stats, stats };
}

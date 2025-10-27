/**
 * SM-2 Spaced Repetition Algorithm
 * Implementation based on SuperMemo SM-2 algorithm
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

class SM2Card {
    /**
     * Create a new SM-2 card for a character
     * @param {string} character - Thai character
     */
    constructor(character) {
        this.character = character;
        this.easeFactor = 2.5; // Initial ease factor
        this.interval = 0; // Days until next review
        this.repetitions = 0; // Number of consecutive correct reviews
        this.nextReview = Date.now(); // Timestamp of next review (initially due now)
        this.lastReviewed = null; // Timestamp of last review

        // Statistics
        this.totalReviews = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.averageResponseTime = 0;

        // State
        this.isNew = true; // Never been reviewed
        this.isLearning = false; // In learning phase (repetitions 0-1)
        this.isMature = false; // Mature card (repetitions >= 2)
    }

    /**
     * Review the card with a quality grade
     * @param {number} quality - Quality of recall (0-5)
     *   0: Complete blackout
     *   1: Incorrect but familiar
     *   2: Incorrect but easy to recall correct answer
     *   3: Correct but difficult
     *   4: Correct with some hesitation
     *   5: Perfect recall
     * @param {number} responseTime - Time taken to answer in milliseconds
     */
    review(quality, responseTime = 0) {
        // Validate quality
        quality = Math.max(0, Math.min(5, quality));

        // Update statistics
        this.totalReviews++;
        this.lastReviewed = Date.now();
        this.isNew = false;

        if (responseTime > 0) {
            // Update average response time (exponential moving average)
            if (this.averageResponseTime === 0) {
                this.averageResponseTime = responseTime;
            } else {
                this.averageResponseTime = this.averageResponseTime * 0.8 + responseTime * 0.2;
            }
        }

        // SM-2 Algorithm Core Logic
        if (quality >= 3) {
            // Correct answer
            this.correctCount++;

            // Calculate new interval
            if (this.repetitions === 0) {
                this.interval = 1; // 1 day
                this.isLearning = true;
            } else if (this.repetitions === 1) {
                this.interval = 6; // 6 days
                this.isLearning = true;
            } else {
                // interval = previous_interval * ease_factor
                this.interval = Math.round(this.interval * this.easeFactor);
                this.isLearning = false;
                this.isMature = true;
            }

            this.repetitions++;
        } else {
            // Incorrect answer - reset to beginning
            this.incorrectCount++;
            this.repetitions = 0;
            this.interval = 1; // Start over with 1 day interval
            this.isLearning = true;
            this.isMature = false;
        }

        // Update ease factor based on quality
        // EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        const qualityFactor = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
        this.easeFactor = Math.max(1.3, this.easeFactor + qualityFactor);

        // Schedule next review
        // Convert days to milliseconds
        const intervalMs = this.interval * 24 * 60 * 60 * 1000;
        this.nextReview = Date.now() + intervalMs;
    }

    /**
     * Check if card is due for review
     * @returns {boolean}
     */
    isDue() {
        return Date.now() >= this.nextReview;
    }

    /**
     * Get days until next review (can be negative if overdue)
     * @returns {number}
     */
    getDaysUntilReview() {
        const msUntilReview = this.nextReview - Date.now();
        return msUntilReview / (24 * 60 * 60 * 1000);
    }

    /**
     * Get how overdue this card is in days
     * @returns {number} - Positive if overdue, 0 if not
     */
    getDaysOverdue() {
        if (!this.isDue()) return 0;
        return Math.abs(this.getDaysUntilReview());
    }

    /**
     * Get accuracy rate for this card
     * @returns {number} - Percentage (0-100)
     */
    getAccuracy() {
        if (this.totalReviews === 0) return 0;
        return (this.correctCount / this.totalReviews) * 100;
    }

    /**
     * Get difficulty rating based on ease factor
     * @returns {string} - 'very-hard', 'hard', 'medium', 'easy', 'very-easy'
     */
    getDifficulty() {
        if (this.easeFactor < 1.7) return 'very-hard';
        if (this.easeFactor < 2.0) return 'hard';
        if (this.easeFactor < 2.5) return 'medium';
        if (this.easeFactor < 2.8) return 'easy';
        return 'very-easy';
    }

    /**
     * Get card state for display
     * @returns {string} - 'new', 'learning', 'mature'
     */
    getState() {
        if (this.isNew) return 'new';
        if (this.isLearning) return 'learning';
        if (this.isMature) return 'mature';
        return 'unknown';
    }

    /**
     * Serialize card to plain object for storage
     * @returns {object}
     */
    toJSON() {
        return {
            character: this.character,
            easeFactor: this.easeFactor,
            interval: this.interval,
            repetitions: this.repetitions,
            nextReview: this.nextReview,
            lastReviewed: this.lastReviewed,
            totalReviews: this.totalReviews,
            correctCount: this.correctCount,
            incorrectCount: this.incorrectCount,
            averageResponseTime: this.averageResponseTime,
            isNew: this.isNew,
            isLearning: this.isLearning,
            isMature: this.isMature
        };
    }

    /**
     * Deserialize plain object to SM2Card instance
     * @param {object} data - Plain object from JSON
     * @returns {SM2Card}
     */
    static fromJSON(data) {
        const card = new SM2Card(data.character);
        Object.assign(card, data);
        return card;
    }
}

/**
 * SM2 Deck Manager
 * Manages a collection of SM2 cards and scheduling logic
 */
class SM2Deck {
    constructor() {
        this.cards = new Map(); // character -> SM2Card
        this.newCardsPerDay = 5; // Limit new cards per day
        this.maxReviewsPerSession = 50; // Limit reviews per session
    }

    /**
     * Add or update a card in the deck
     * @param {string} character - Thai character
     */
    addCard(character) {
        if (!this.cards.has(character)) {
            this.cards.set(character, new SM2Card(character));
        }
        return this.cards.get(character);
    }

    /**
     * Get a card from the deck
     * @param {string} character
     * @returns {SM2Card}
     */
    getCard(character) {
        return this.cards.get(character);
    }

    /**
     * Get all due cards sorted by priority (most overdue first)
     * @returns {SM2Card[]}
     */
    getDueCards() {
        const dueCards = Array.from(this.cards.values()).filter(card => card.isDue());
        // Sort by days overdue (descending)
        return dueCards.sort((a, b) => b.getDaysOverdue() - a.getDaysOverdue());
    }

    /**
     * Get new cards that haven't been reviewed yet
     * @param {number} limit - Maximum number of new cards to return
     * @returns {SM2Card[]}
     */
    getNewCards(limit = this.newCardsPerDay) {
        const newCards = Array.from(this.cards.values()).filter(card => card.isNew);
        return newCards.slice(0, limit);
    }

    /**
     * Get next card to review (due cards first, then new cards)
     * @returns {SM2Card|null}
     */
    getNextCard() {
        // Priority 1: Due cards (most overdue first)
        const dueCards = this.getDueCards();
        if (dueCards.length > 0) {
            return dueCards[0];
        }

        // Priority 2: New cards (up to daily limit)
        const newCards = this.getNewCards(1);
        if (newCards.length > 0) {
            return newCards[0];
        }

        return null;
    }

    /**
     * Get deck statistics
     * @returns {object}
     */
    getStats() {
        const cards = Array.from(this.cards.values());

        return {
            total: cards.length,
            new: cards.filter(c => c.isNew).length,
            learning: cards.filter(c => c.isLearning && !c.isNew).length,
            mature: cards.filter(c => c.isMature).length,
            due: cards.filter(c => c.isDue()).length,
            totalReviews: cards.reduce((sum, c) => sum + c.totalReviews, 0),
            totalCorrect: cards.reduce((sum, c) => sum + c.correctCount, 0),
            totalIncorrect: cards.reduce((sum, c) => sum + c.incorrectCount, 0)
        };
    }

    /**
     * Serialize deck to JSON
     * @returns {object}
     */
    toJSON() {
        const cardsData = {};
        this.cards.forEach((card, character) => {
            cardsData[character] = card.toJSON();
        });
        return {
            cards: cardsData,
            newCardsPerDay: this.newCardsPerDay,
            maxReviewsPerSession: this.maxReviewsPerSession
        };
    }

    /**
     * Deserialize deck from JSON
     * @param {object} data
     * @returns {SM2Deck}
     */
    static fromJSON(data) {
        const deck = new SM2Deck();
        deck.newCardsPerDay = data.newCardsPerDay || 5;
        deck.maxReviewsPerSession = data.maxReviewsPerSession || 50;

        if (data.cards) {
            Object.entries(data.cards).forEach(([character, cardData]) => {
                deck.cards.set(character, SM2Card.fromJSON(cardData));
            });
        }

        return deck;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SM2Card, SM2Deck };
}

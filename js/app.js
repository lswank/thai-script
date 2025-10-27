/**
 * Main Application Controller
 * Coordinates all modules and implements game loop
 */

class ThaiScriptApp {
    constructor() {
        this.data = null;
        this.deck = null;
        this.currentCard = null;
        this.currentCharacter = null;
        this.answerStartTime = null;
        this.awaitingNextCard = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Thai Script Master...');

        // Load data from storage
        this.loadData();

        // Initialize deck
        this.initializeDeck();

        // Start session
        this.startSession();

        // Setup UI
        this.setupUI();

        // Start first card
        this.nextCard();

        console.log('App initialized successfully!');
    }

    /**
     * Load data from storage
     */
    loadData() {
        this.data = storage.load();
        console.log('Data loaded:', this.data);

        // Check and unlock levels
        this.checkLevelUnlocks();
    }

    /**
     * Save data to storage
     */
    saveData() {
        storage.save(this.data);
    }

    /**
     * Initialize SM-2 deck with cards for current level
     */
    initializeDeck() {
        // Create deck from stored data or new
        if (this.data.deck.cards && Object.keys(this.data.deck.cards).length > 0) {
            this.deck = SM2Deck.fromJSON(this.data.deck);
        } else {
            this.deck = new SM2Deck();
            this.deck.newCardsPerDay = this.data.deck.newCardsPerDay || 5;
        }

        // Ensure all characters from current level exist in deck
        const levelChars = ThaiData.getLevelCharacters(this.data.settings.currentLevel);
        levelChars.forEach(char => {
            if (!this.deck.getCard(char)) {
                this.deck.addCard(char);
            }
        });

        console.log('Deck initialized:', this.deck.getStats());
    }

    /**
     * Start a new session
     */
    startSession() {
        stats.startSession();
        this.data.session.startTime = Date.now();
        this.data.session.reviewsThisSession = 0;
        this.data.session.correctThisSession = 0;
        this.data.session.wrongThisSession = 0;
        this.saveData();
    }

    /**
     * Setup UI event listeners
     */
    setupUI() {
        // Submit button
        ui.elements.submitBtn?.addEventListener('click', () => this.checkAnswer());

        // Real-time input validation
        ui.elements.romanInput?.addEventListener('input', (e) => {
            if (this.currentCharacter) {
                const userInput = e.target.value.trim().toLowerCase();
                const correctAnswer = ThaiData.getRomanization(this.currentCharacter).toLowerCase();
                ui.validateInputRealTime(userInput, correctAnswer);
            }
        });

        // Enter key in input (handled by UI module)
        // But we need to ensure focus
        ui.focusInput();

        // Setup modal listeners
        ui.setupModalListeners(this);

        // Setup keyboard shortcuts
        ui.setupKeyboardShortcuts(this);

        // Update settings display
        ui.updateSettingsInputs(this.data);

        // Initial stats update
        ui.updateStats(this.data, stats);
    }

    /**
     * Get next card to practice
     */
    nextCard() {
        if (this.awaitingNextCard) {
            this.awaitingNextCard = false;
        }

        // Get next card from deck
        this.currentCard = this.deck.getNextCard();

        if (!this.currentCard) {
            // No more cards available
            ui.showSessionComplete();
            console.log('No more cards to review!');
            return;
        }

        this.currentCharacter = this.currentCard.character;

        // Display character
        ui.displayCharacter(this.currentCharacter);
        ui.hideFeedback();
        ui.hideEducationalPanel(); // Hide any educational content
        ui.clearInput();
        ui.focusInput();
        ui.enableInput();
        ui.animateCharacterTransition();

        // Reset input styling
        ui.elements.romanInput.className = 'roman-input';

        // Start timing
        this.answerStartTime = Date.now();

        console.log('Next card:', this.currentCharacter, ThaiData.getRomanization(this.currentCharacter));
    }

    /**
     * Check user's answer
     */
    checkAnswer() {
        if (this.awaitingNextCard) {
            this.nextCard();
            return;
        }

        if (!this.currentCard) {
            return;
        }

        // Get input
        const userAnswer = ui.getInput();
        if (!userAnswer) {
            return; // Empty input, ignore
        }

        // Calculate response time
        const responseTime = Date.now() - this.answerStartTime;
        stats.recordResponseTime(responseTime);

        // Get correct answer
        const correctAnswer = ThaiData.getRomanization(this.currentCharacter);

        // Check if correct
        const isCorrect = userAnswer === correctAnswer.toLowerCase();

        if (isCorrect) {
            // CORRECT ANSWER FLOW
            ui.showFeedback(true, correctAnswer);
            ui.disableInput();

            // Update statistics
            this.updateStatistics(true, responseTime);

            // Calculate quality grade for SM-2
            const quality = stats.calculateQuality(true, responseTime);

            // Review card with SM-2 algorithm
            this.currentCard.review(quality, responseTime);

            // Update deck data
            this.data.deck = this.deck.toJSON();

            // Save data
            this.saveData();

            // Update UI stats
            ui.updateStats(this.data, stats);

            // Check for level unlocks
            this.checkLevelUnlocks();

            // Wait before next card
            this.awaitingNextCard = true;
            setTimeout(() => {
                if (this.awaitingNextCard) {
                    this.nextCard();
                }
            }, 1500);

        } else {
            // WRONG ANSWER FLOW - EDUCATIONAL MODE
            // 1. Trigger violent shake animation
            ui.triggerWrongAnimation();

            // 2. Play error sound (optional - browser will handle)

            // 3. Hide simple feedback, show educational panel
            ui.hideFeedback();
            ui.disableInput();

            // 4. Show comprehensive educational panel with re-type requirement
            setTimeout(() => {
                ui.showEducationalPanel(this.currentCharacter, userAnswer);

                // Play audio pronunciation
                ui.playAudio(this.currentCharacter, correctAnswer);
            }, 600); // Wait for shake animation to complete

            // 5. Update statistics
            this.updateStatistics(false, responseTime);

            // 6. Calculate quality grade for SM-2 (wrong = low quality)
            const quality = stats.calculateQuality(false, responseTime);

            // 7. Review card with SM-2 algorithm
            this.currentCard.review(quality, responseTime);

            // 8. Update deck data
            this.data.deck = this.deck.toJSON();

            // 9. Save data
            this.saveData();

            // 10. Update UI stats
            ui.updateStats(this.data, stats);

            // 11. Check for level unlocks
            this.checkLevelUnlocks();

            // NOTE: No auto-advance! User must re-type correct answer.
            // proceedAfterRetype() will be called when they type it correctly.
        }
    }

    /**
     * Proceed to next card after user successfully re-types correct answer
     * Called by UI after re-type validation passes
     */
    proceedAfterRetype() {
        // Hide educational panel
        ui.hideEducationalPanel();

        // Move to next card
        this.nextCard();
    }

    /**
     * Update session and overall statistics
     */
    updateStatistics(correct, responseTime) {
        // Session stats
        this.data.session.reviewsThisSession++;

        if (correct) {
            this.data.session.correctThisSession++;
            this.data.session.currentStreak++;
            if (this.data.session.currentStreak > this.data.session.longestStreak) {
                this.data.session.longestStreak = this.data.session.currentStreak;
            }
        } else {
            this.data.session.wrongThisSession++;
            this.data.session.currentStreak = 0;

            // Record confusion if wrong
            // Note: For full confusion matrix, we'd need to know what they typed
            // For now, just track that this character was wrong
        }

        // Daily stats
        storage.recordDailyStats(this.data, correct);

        // Total sessions count
        if (this.data.session.reviewsThisSession === 1) {
            this.data.stats.sessionsCount++;
        }
    }

    /**
     * Check if any levels should be unlocked
     */
    checkLevelUnlocks() {
        const currentUnlocked = this.data.settings.unlockedLevels;

        // Check each level
        for (let levelNum = 1; levelNum <= 3; levelNum++) {
            if (!currentUnlocked.includes(levelNum)) {
                if (stats.shouldUnlockLevel(this.data, levelNum)) {
                    // Unlock level
                    this.data.settings.unlockedLevels.push(levelNum);
                    this.data.settings.currentLevel = levelNum;

                    // Add cards for new level
                    const levelChars = ThaiData.getLevelCharacters(levelNum);
                    levelChars.forEach(char => {
                        if (!this.deck.getCard(char)) {
                            this.deck.addCard(char);
                        }
                    });

                    // Show notification
                    ui.showLevelUnlock(levelNum);

                    // Save
                    this.data.deck = this.deck.toJSON();
                    this.saveData();

                    console.log(`Level ${levelNum} unlocked!`);
                }
            }
        }
    }

    /**
     * Reveal correct answer (for Escape key)
     */
    revealAnswer() {
        if (!this.currentCard || this.awaitingNextCard) {
            return;
        }

        const correctAnswer = ThaiData.getRomanization(this.currentCharacter);
        ui.showFeedback(false, correctAnswer);

        // This counts as a wrong answer
        const responseTime = Date.now() - this.answerStartTime;
        stats.recordResponseTime(responseTime);

        // Update statistics
        this.updateStatistics(false, responseTime);

        // Review card with low quality (revealed)
        this.currentCard.review(0, responseTime);

        // Update deck data
        this.data.deck = this.deck.toJSON();
        this.saveData();

        // Update UI
        ui.updateStats(this.data, stats);

        // Wait before next card
        this.awaitingNextCard = true;
        ui.disableInput();
        setTimeout(() => {
            if (this.awaitingNextCard) {
                this.nextCard();
            }
        }, 2000);
    }

    /**
     * Get app status for debugging
     */
    getStatus() {
        return {
            currentLevel: this.data.settings.currentLevel,
            unlockedLevels: this.data.settings.unlockedLevels,
            deckStats: this.deck.getStats(),
            sessionStats: {
                reviews: this.data.session.reviewsThisSession,
                correct: this.data.session.correctThisSession,
                wrong: this.data.session.wrongThisSession,
                streak: this.data.session.currentStreak,
                accuracy: stats.calculateSessionAccuracy(this.data)
            },
            overallStats: stats.getTotalStats(this.data)
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // Create and initialize app
    window.app = new ThaiScriptApp();
    window.app.init();

    // Expose for debugging
    window.ThaiData = ThaiData;
    window.stats = stats;
    window.storage = storage;

    console.log('Thai Script Master is ready!');
    console.log('Type app.getStatus() in console for app status');
});

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThaiScriptApp };
}

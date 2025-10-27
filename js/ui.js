/**
 * UI Module
 * Handles all DOM manipulation and UI updates
 */

class UI {
    constructor() {
        // Cache DOM elements
        this.elements = {
            thaiChar: document.getElementById('thaiChar'),
            charHint: document.getElementById('charHint'),
            romanInput: document.getElementById('romanInput'),
            submitBtn: document.getElementById('submitBtn'),
            feedbackArea: document.getElementById('feedbackArea'),
            feedbackMsg: document.getElementById('feedbackMsg'),

            // Stats
            currentLevel: document.getElementById('currentLevel'),
            scoreValue: document.getElementById('scoreValue'),
            accuracyValue: document.getElementById('accuracyValue'),
            streakValue: document.getElementById('streakValue'),
            dueValue: document.getElementById('dueValue'),
            learnedValue: document.getElementById('learnedValue'),
            progressBar: document.getElementById('progressBar'),

            // Modals
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            helpOverlay: document.getElementById('helpOverlay'),
            closeHelp: document.getElementById('closeHelp'),

            // Settings inputs
            newCardsPerDay: document.getElementById('newCardsPerDay'),
            exportData: document.getElementById('exportData'),
            importData: document.getElementById('importData'),
            resetProgress: document.getElementById('resetProgress')
        };
    }

    /**
     * Display Thai character
     * @param {string} character
     */
    displayCharacter(character) {
        this.elements.thaiChar.textContent = character;
        this.elements.thaiChar.className = 'thai-character'; // Reset classes
        this.elements.charHint.textContent = '';
    }

    /**
     * Get input value
     * @returns {string}
     */
    getInput() {
        return this.elements.romanInput.value.trim().toLowerCase();
    }

    /**
     * Clear input field
     */
    clearInput() {
        this.elements.romanInput.value = '';
    }

    /**
     * Focus input field
     */
    focusInput() {
        this.elements.romanInput.focus();
    }

    /**
     * Disable input
     */
    disableInput() {
        this.elements.romanInput.disabled = true;
        this.elements.submitBtn.disabled = true;
    }

    /**
     * Enable input
     */
    enableInput() {
        this.elements.romanInput.disabled = false;
        this.elements.submitBtn.disabled = false;
    }

    /**
     * Show feedback message
     * @param {boolean} correct - Whether answer was correct
     * @param {string} correctAnswer - The correct romanization
     */
    showFeedback(correct, correctAnswer = null) {
        const msg = this.elements.feedbackMsg;
        const char = this.elements.thaiChar;

        if (correct) {
            msg.textContent = 'Correct!';
            msg.className = 'feedback-message correct';
            char.classList.add('correct');
        } else {
            msg.textContent = `Incorrect. Correct answer: ${correctAnswer}`;
            msg.className = 'feedback-message incorrect';
            char.classList.add('incorrect');
        }

        // Show feedback with animation
        this.elements.feedbackArea.style.opacity = '1';
    }

    /**
     * Hide feedback message
     */
    hideFeedback() {
        this.elements.feedbackArea.style.opacity = '0';
        this.elements.feedbackMsg.textContent = '';
        this.elements.feedbackMsg.className = 'feedback-message';
    }

    /**
     * Update statistics display
     * @param {object} data - Storage data
     * @param {object} sessionStats - Current session stats
     */
    updateStats(data, sessionStats) {
        // Score
        const correct = data.session.correctThisSession;
        const total = data.session.reviewsThisSession;
        this.elements.scoreValue.textContent = `${correct}/${total}`;

        // Accuracy
        const accuracy = stats.calculateSessionAccuracy(data);
        this.elements.accuracyValue.textContent = stats.formatPercentage(accuracy);

        // Streak
        this.elements.streakValue.textContent = data.session.currentStreak.toString();

        // Due cards
        const dueCount = stats.getDueCardsCount(data);
        this.elements.dueValue.textContent = dueCount.toString();

        // Learned today
        const learnedCount = stats.getLearnedTodayCount(data);
        this.elements.learnedValue.textContent = learnedCount.toString();

        // Level
        this.elements.currentLevel.textContent = data.settings.currentLevel.toString();

        // Progress bar (session progress)
        const progress = this.calculateSessionProgress(data);
        this.elements.progressBar.style.width = `${progress}%`;
    }

    /**
     * Calculate session progress percentage
     * @param {object} data
     * @returns {number} - Percentage (0-100)
     */
    calculateSessionProgress(data) {
        const reviewed = data.session.reviewsThisSession;
        const target = 20; // Target reviews per session
        return Math.min(100, (reviewed / target) * 100);
    }

    /**
     * Show settings modal
     */
    showSettings() {
        this.elements.settingsModal.style.display = 'flex';
    }

    /**
     * Hide settings modal
     */
    hideSettings() {
        this.elements.settingsModal.style.display = 'none';
    }

    /**
     * Show help overlay
     */
    showHelp() {
        this.elements.helpOverlay.style.display = 'flex';
    }

    /**
     * Hide help overlay
     */
    hideHelp() {
        this.elements.helpOverlay.style.display = 'none';
    }

    /**
     * Update settings inputs with current values
     * @param {object} data
     */
    updateSettingsInputs(data) {
        this.elements.newCardsPerDay.value = data.deck.newCardsPerDay || 5;
    }

    /**
     * Show level unlock notification
     * @param {number} level
     */
    showLevelUnlock(level) {
        const levelInfo = ThaiData.getLevelInfo(level);
        if (!levelInfo) return;

        alert(`🎉 Level ${level} Unlocked!\n\n${levelInfo.description}\n\nYou can now practice ${levelInfo.characters.length} characters!`);
    }

    /**
     * Show completion message
     */
    showSessionComplete() {
        const msg = this.elements.feedbackMsg;
        msg.textContent = 'Great session! All due cards reviewed.';
        msg.className = 'feedback-message correct';
        this.elements.feedbackArea.style.opacity = '1';
    }

    /**
     * Show error message
     * @param {string} message
     */
    showError(message) {
        const msg = this.elements.feedbackMsg;
        msg.textContent = message;
        msg.className = 'feedback-message incorrect';
        this.elements.feedbackArea.style.opacity = '1';
    }

    /**
     * Animate character transition
     */
    animateCharacterTransition() {
        const char = this.elements.thaiChar;
        char.style.opacity = '0';
        char.style.transform = 'scale(0.9)';

        setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Set up event listeners for modal controls
     */
    setupModalListeners(app) {
        // Settings modal
        this.elements.settingsBtn?.addEventListener('click', () => this.showSettings());
        this.elements.closeSettings?.addEventListener('click', () => this.hideSettings());

        // Close modals on outside click
        this.elements.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.hideSettings();
            }
        });

        // Help overlay
        this.elements.closeHelp?.addEventListener('click', () => this.hideHelp());
        this.elements.helpOverlay?.addEventListener('click', (e) => {
            if (e.target === this.elements.helpOverlay) {
                this.hideHelp();
            }
        });

        // Settings actions
        this.elements.exportData?.addEventListener('click', () => {
            storage.downloadExport();
        });

        this.elements.importData?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const success = storage.importData(event.target.result);
                        if (success) {
                            alert('Data imported successfully! Reloading...');
                            window.location.reload();
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });

        this.elements.resetProgress?.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                if (confirm('Really sure? This will delete everything!')) {
                    storage.clearAll();
                    alert('Progress reset. Reloading...');
                    window.location.reload();
                }
            }
        });

        // New cards per day setting
        this.elements.newCardsPerDay?.addEventListener('change', (e) => {
            if (app) {
                app.data.deck.newCardsPerDay = parseInt(e.target.value);
                app.deck.newCardsPerDay = parseInt(e.target.value);
                app.saveData();
            }
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts(app) {
        document.addEventListener('keydown', (e) => {
            // Don't intercept if typing in input
            if (document.activeElement === this.elements.romanInput) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.elements.submitBtn.click();
                }
                return;
            }

            // Global shortcuts
            switch (e.key) {
                case 'Escape':
                    if (this.elements.helpOverlay.style.display === 'flex') {
                        this.hideHelp();
                    } else if (this.elements.settingsModal.style.display === 'flex') {
                        this.hideSettings();
                    } else {
                        // Reveal answer
                        app?.revealAnswer();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    app?.nextCard();
                    break;
                case 's':
                case 'S':
                    this.showSettings();
                    break;
                case '?':
                    this.showHelp();
                    break;
            }
        });
    }
}

// Create singleton instance
const ui = new UI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI, ui };
}

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
            charDisplay: document.querySelector('.character-display'),
            romanInput: document.getElementById('romanInput'),
            submitBtn: document.getElementById('submitBtn'),
            feedbackArea: document.getElementById('feedbackArea'),
            feedbackMsg: document.getElementById('feedbackMsg'),
            educationalPanel: document.getElementById('educationalPanel'),

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
     * Validate input in real-time and provide visual feedback
     * @param {string} userInput - Current input
     * @param {string} correctAnswer - Correct romanization
     */
    validateInputRealTime(userInput, correctAnswer) {
        const input = this.elements.romanInput;

        if (!userInput) {
            // Empty input - reset to default
            input.className = 'roman-input';
            return;
        }

        // Check if user input is a valid prefix of correct answer
        if (correctAnswer.startsWith(userInput)) {
            // On the right track
            if (userInput === correctAnswer) {
                input.className = 'roman-input input-correct';
            } else {
                input.className = 'roman-input input-partial';
            }
        } else {
            // Wrong direction
            input.className = 'roman-input input-wrong';
        }
    }

    /**
     * Trigger violent shake and red flash animation
     */
    triggerWrongAnimation() {
        const char = this.elements.thaiChar;
        const display = this.elements.charDisplay;

        // Remove existing classes
        char.classList.remove('correct', 'incorrect');
        display.classList.remove('flash-red');

        // Trigger reflow to restart animation
        void char.offsetWidth;

        // Add animation classes
        char.classList.add('incorrect');
        display.classList.add('flash-red');

        // Remove after animation completes
        setTimeout(() => {
            display.classList.remove('flash-red');
        }, 600);
    }

    /**
     * Show comprehensive educational panel with tabs
     * @param {string} character - The Thai character
     * @param {string} userAnswer - What the user typed (wrong answer)
     */
    showEducationalPanel(character, userAnswer) {
        const data = ThaiData.getCharacterData(character);
        if (!data) return;

        const panel = this.elements.educationalPanel;

        // Build comparison characters HTML
        const confusedChars = data.confusesWith || [];
        let comparisonHTML = '';

        if (confusedChars.length > 0) {
            comparisonHTML = '<div class="char-comparison">';
            // Show current character
            comparisonHTML += `
                <div class="comparison-item">
                    <div class="comparison-char">${character}</div>
                    <div class="comparison-label">${data.roman} (${data.name})</div>
                </div>
            `;
            // Show confused characters
            confusedChars.forEach(confusedChar => {
                const confusedData = ThaiData.getCharacterData(confusedChar);
                if (confusedData) {
                    comparisonHTML += `
                        <div class="comparison-item">
                            <div class="comparison-char">${confusedChar}</div>
                            <div class="comparison-label">${confusedData.roman} (${confusedData.name})</div>
                        </div>
                    `;
                }
            });
            comparisonHTML += '</div>';
        } else {
            comparisonHTML = '<p class="edu-text">This character has no common confusion pairs.</p>';
        }

        // Build visual features HTML
        const features = data.visualFeatures || [];
        let featuresHTML = '';
        if (features.length > 0) {
            featuresHTML = '<ul class="visual-features">';
            features.forEach(feature => {
                featuresHTML += `<li>${feature}</li>`;
            });
            featuresHTML += '</ul>';
        } else {
            featuresHTML = '<p class="edu-text">No specific visual features noted.</p>';
        }

        // Build tabbed panel HTML
        panel.innerHTML = `
            <!-- Panel Header -->
            <div class="edu-panel-header">
                <div class="edu-title">❌ Let's Learn This Character!</div>
                <div class="edu-answer-display">${data.roman}</div>
                <div class="edu-char-name">${character} (${data.name})</div>
            </div>

            <!-- Tabs -->
            <div class="edu-tabs">
                <button class="edu-tab active" data-tab="why">📚 Why?</button>
                <button class="edu-tab" data-tab="mnemonic">🧠 Memory</button>
                <button class="edu-tab" data-tab="visual">👀 Visual</button>
                <button class="edu-tab" data-tab="comparison">⚠️  Compare</button>
            </div>

            <!-- Tab: Why -->
            <div class="edu-tab-content active" data-content="why">
                <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Why "${data.roman}"?</h3>
                <p class="edu-text">${data.explanation}</p>
                <button class="audio-button" onclick="ui.playAudio('${character}', '${data.roman}')">
                    🔊 Play Pronunciation
                </button>
            </div>

            <!-- Tab: Mnemonic -->
            <div class="edu-tab-content" data-content="mnemonic">
                <h3 style="margin-bottom: 1rem; color: var(--warning-color);">Memory Device</h3>
                <div class="edu-mnemonic">${data.mnemonic}</div>
            </div>

            <!-- Tab: Visual Features -->
            <div class="edu-tab-content" data-content="visual">
                <h3 style="margin-bottom: 1rem; color: var(--success-color);">Visual Features</h3>
                ${featuresHTML}
            </div>

            <!-- Tab: Comparison -->
            <div class="edu-tab-content" data-content="comparison">
                <h3 style="margin-bottom: 1rem; color: var(--error-color);">Don't Confuse With</h3>
                ${comparisonHTML}
            </div>

            <!-- Sticky Re-Type Footer -->
            <div class="retype-container">
                <div class="retype-label">✏️  Type "${data.roman}" to continue:</div>
                <input
                    type="text"
                    class="retype-input"
                    id="retypeInput"
                    placeholder="Type ${data.roman}..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="false"
                />
            </div>
        `;

        // Setup tab switching
        this.setupTabs();

        // Show panel with animation
        panel.classList.add('show');

        // Focus retype input and set up validation
        setTimeout(() => {
            const retypeInput = document.getElementById('retypeInput');
            if (retypeInput) {
                retypeInput.focus();
                this.setupRetypeValidation(retypeInput, data.roman);
            }
        }, 100);
    }

    /**
     * Setup tab switching functionality
     */
    setupTabs() {
        const tabs = document.querySelectorAll('.edu-tab');
        const contents = document.querySelectorAll('.edu-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');

                // Remove active from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active to clicked tab and corresponding content
                tab.classList.add('active');
                const activeContent = document.querySelector(`.edu-tab-content[data-content="${tabName}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }

    /**
     * Hide educational panel
     */
    hideEducationalPanel() {
        this.elements.educationalPanel.classList.remove('show');
        this.elements.educationalPanel.innerHTML = '';
    }

    /**
     * Play audio pronunciation (Web Speech API fallback)
     * @param {string} character - Thai character
     * @param {string} romanization - Romanization
     */
    playAudio(character, romanization) {
        // Try Web Speech API (Thai text-to-speech)
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(character);
            utterance.lang = 'th-TH';
            utterance.rate = 0.8; // Slower for learning
            utterance.pitch = 1.0;

            // Try to find Thai voice
            const voices = window.speechSynthesis.getVoices();
            const thaiVoice = voices.find(voice => voice.lang.startsWith('th'));
            if (thaiVoice) {
                utterance.voice = thaiVoice;
            }

            window.speechSynthesis.speak(utterance);

            // Fallback: also say the romanization in English
            setTimeout(() => {
                const romanUtterance = new SpeechSynthesisUtterance(romanization);
                romanUtterance.lang = 'en-US';
                romanUtterance.rate = 0.7;
                window.speechSynthesis.speak(romanUtterance);
            }, 1000);
        } else {
            alert('Audio playback not supported in this browser.');
        }
    }

    /**
     * Setup validation for retype input
     * @param {HTMLElement} input - Retype input element
     * @param {string} correctAnswer - What they should type
     */
    setupRetypeValidation(input, correctAnswer) {
        if (!input) return;

        input.addEventListener('input', (e) => {
            const value = e.target.value.trim().toLowerCase();
            const correct = correctAnswer.toLowerCase();

            if (value === correct) {
                input.classList.add('correct');
                // Auto-proceed after short delay
                setTimeout(() => {
                    if (window.app) {
                        window.app.proceedAfterRetype();
                    }
                }, 500);
            } else {
                input.classList.remove('correct');
            }
        });

        // Also allow Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim().toLowerCase();
                const correct = correctAnswer.toLowerCase();
                if (value === correct && window.app) {
                    window.app.proceedAfterRetype();
                }
            }
        });
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

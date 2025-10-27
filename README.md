# Thai Script Master

A deliberate practice web application for learning Thai script using spaced repetition (SM-2 algorithm).

## Features

### MVP (v0.1)
- 44 Thai consonants with RTGS romanization
- SM-2 spaced repetition algorithm (Anki-style)
- Progressive level system (common → intermediate → all characters)
- Immediate feedback and statistics tracking
- localStorage persistence
- Mobile responsive design

### Planned Features
- Confusion pair detection and targeted drills
- Multiple drill modes (speed, multiple choice, reverse, flash cards)
- Audio pronunciation with native Thai speech
- Analytics dashboard (learning curves, heatmaps, mastery grid)
- Vowels and diphthongs support
- Dark mode and PWA support

## Deliberate Practice Principles

This app applies research-backed learning techniques:

1. **Spaced Repetition**: SM-2 algorithm schedules reviews at optimal intervals
2. **Immediate Feedback**: Instant correct/incorrect responses
3. **Error Analysis**: Track and drill confused character pairs
4. **Progress Tracking**: Visual statistics and learning curves
5. **Difficulty Progression**: Unlock characters as you master previous ones
6. **Focused Practice**: One character at a time, distraction-free

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 + CSS3
- localStorage for persistence
- GitHub Pages for deployment

## Development

```bash
# Clone the repository
git clone https://github.com/[username]/thai-script.git

# Open index.html in browser
open index.html
```

No build process required - just open `index.html` in a modern browser.

## Project Structure

```
thai-script/
├── index.html          # Main application
├── css/
│   └── styles.css     # All styles
├── js/
│   ├── app.js         # Main controller
│   ├── sm2.js         # SM-2 algorithm
│   ├── data.js        # Thai character data
│   ├── storage.js     # localStorage wrapper
│   ├── stats.js       # Statistics engine
│   └── ui.js          # UI rendering
├── assets/
│   └── audio/         # Pronunciation files (future)
└── README.md
```

## Usage

1. Open the app in your browser
2. Type the romanization (RTGS) of the displayed Thai character
3. Press Enter or click Check
4. Review your statistics and progress
5. Return daily to review due characters

## License

MIT

## Contributing

See [Issues](https://github.com/[username]/thai-script/issues) for planned features and bugs.

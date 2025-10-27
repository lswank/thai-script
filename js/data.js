/**
 * Thai Character Data Layer
 * Contains all Thai consonants with RTGS romanization and metadata
 */

// Thai Consonant Mappings (RTGS - Royal Thai General System of Transcription)
const THAI_CHARACTERS = {
    // Ko class
    'ก': { roman: 'k', class: 'mid', frequency: 'very-high', name: 'ko kai' },
    'ข': { roman: 'kh', class: 'high', frequency: 'high', name: 'kho khai' },
    'ฃ': { roman: 'kh', class: 'high', frequency: 'rare', name: 'kho khuat' },
    'ค': { roman: 'kh', class: 'low', frequency: 'high', name: 'kho khwai' },
    'ฅ': { roman: 'kh', class: 'low', frequency: 'obsolete', name: 'kho khon' },
    'ฆ': { roman: 'kh', class: 'low', frequency: 'low', name: 'kho rakhang' },

    // Ngo
    'ง': { roman: 'ng', class: 'low', frequency: 'very-high', name: 'ngo ngu' },

    // Cho class
    'จ': { roman: 'ch', class: 'mid', frequency: 'high', name: 'cho chan' },
    'ฉ': { roman: 'ch', class: 'high', frequency: 'medium', name: 'cho ching' },
    'ช': { roman: 'ch', class: 'low', frequency: 'high', name: 'cho chang' },
    'ซ': { roman: 's', class: 'low', frequency: 'medium', name: 'so so' },
    'ฌ': { roman: 'ch', class: 'low', frequency: 'low', name: 'cho choe' },

    // Yo class
    'ญ': { roman: 'y', class: 'low', frequency: 'medium', name: 'yo ying' },

    // Do/To class
    'ฎ': { roman: 'd', class: 'mid', frequency: 'low', name: 'do chada' },
    'ฏ': { roman: 't', class: 'mid', frequency: 'low', name: 'to patak' },
    'ฐ': { roman: 'th', class: 'high', frequency: 'low', name: 'tho than' },
    'ฑ': { roman: 'th', class: 'low', frequency: 'low', name: 'tho montho' },
    'ฒ': { roman: 'th', class: 'low', frequency: 'low', name: 'tho phu thao' },
    'ณ': { roman: 'n', class: 'low', frequency: 'medium', name: 'no nen' },
    'ด': { roman: 'd', class: 'mid', frequency: 'very-high', name: 'do dek' },
    'ต': { roman: 't', class: 'mid', frequency: 'very-high', name: 'to tao' },
    'ถ': { roman: 'th', class: 'high', frequency: 'high', name: 'tho thung' },
    'ท': { roman: 'th', class: 'low', frequency: 'high', name: 'tho thahan' },
    'ธ': { roman: 'th', class: 'low', frequency: 'medium', name: 'tho thong' },
    'น': { roman: 'n', class: 'low', frequency: 'very-high', name: 'no nu' },

    // Bo/Po class
    'บ': { roman: 'b', class: 'mid', frequency: 'high', name: 'bo baimai' },
    'ป': { roman: 'p', class: 'mid', frequency: 'very-high', name: 'po pla' },
    'ผ': { roman: 'ph', class: 'high', frequency: 'high', name: 'pho phueng' },
    'ฝ': { roman: 'f', class: 'high', frequency: 'medium', name: 'fo fa' },
    'พ': { roman: 'ph', class: 'low', frequency: 'high', name: 'pho phan' },
    'ฟ': { roman: 'f', class: 'low', frequency: 'medium', name: 'fo fan' },
    'ภ': { roman: 'ph', class: 'low', frequency: 'medium', name: 'pho samphao' },
    'ม': { roman: 'm', class: 'low', frequency: 'very-high', name: 'mo ma' },

    // Yo/Ro/Lo class
    'ย': { roman: 'y', class: 'low', frequency: 'very-high', name: 'yo yak' },
    'ร': { roman: 'r', class: 'low', frequency: 'very-high', name: 'ro ruea' },
    'ฤ': { roman: 'rue', class: 'low', frequency: 'low', name: 'rue' },
    'ล': { roman: 'l', class: 'low', frequency: 'very-high', name: 'lo ling' },
    'ฦ': { roman: 'lue', class: 'low', frequency: 'rare', name: 'lue' },
    'ว': { roman: 'w', class: 'low', frequency: 'very-high', name: 'wo waen' },
    'ศ': { roman: 's', class: 'high', frequency: 'medium', name: 'so sala' },
    'ษ': { roman: 's', class: 'high', frequency: 'medium', name: 'so rue si' },
    'ส': { roman: 's', class: 'high', frequency: 'very-high', name: 'so suea' },

    // Ho class
    'ห': { roman: 'h', class: 'high', frequency: 'very-high', name: 'ho hip' },
    'ฬ': { roman: 'l', class: 'low', frequency: 'rare', name: 'lo chula' },
    'อ': { roman: 'o', class: 'mid', frequency: 'very-high', name: 'o ang' },
    'ฮ': { roman: 'h', class: 'low', frequency: 'medium', name: 'ho nokhuk' }
};

// Progressive Level System
// Level 1: 19 most common consonants (very-high frequency)
const LEVEL_1_CHARS = [
    'ก', 'ง', 'ด', 'ต', 'น', 'บ', 'ป', 'ม', 'ย', 'ร',
    'ล', 'ว', 'ส', 'ห', 'อ', 'ข', 'ค', 'จ', 'ช'
];

// Level 2: Additional 15 common consonants (high + medium frequency)
const LEVEL_2_CHARS = [
    'ผ', 'พ', 'ถ', 'ท', 'ญ', 'ฉ', 'ฝ', 'ฟ', 'ภ', 'ธ',
    'ซ', 'ศ', 'ษ', 'ฮ', 'ณ'
];

// Level 3: Remaining consonants (low frequency + rare + obsolete)
const LEVEL_3_CHARS = [
    'ฆ', 'ฌ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ฤ', 'ฦ', 'ฬ',
    'ฃ', 'ฅ'
];

// Level configuration
const LEVELS = [
    {
        number: 1,
        name: 'Beginner',
        characters: LEVEL_1_CHARS,
        unlockThreshold: 0, // Always unlocked
        description: 'Most common Thai consonants'
    },
    {
        number: 2,
        name: 'Intermediate',
        characters: [...LEVEL_1_CHARS, ...LEVEL_2_CHARS],
        unlockThreshold: 0.80, // 80% accuracy on level 1
        description: 'Add more common consonants'
    },
    {
        number: 3,
        name: 'Advanced',
        characters: [...LEVEL_1_CHARS, ...LEVEL_2_CHARS, ...LEVEL_3_CHARS],
        unlockThreshold: 0.80, // 80% accuracy on level 2
        description: 'All 44 Thai consonants'
    }
];

// Helper Functions
const ThaiData = {
    /**
     * Get romanization for a Thai character
     */
    getRomanization(char) {
        return THAI_CHARACTERS[char]?.roman || '';
    },

    /**
     * Get all data for a character
     */
    getCharacterData(char) {
        return THAI_CHARACTERS[char];
    },

    /**
     * Get characters for a specific level
     */
    getLevelCharacters(levelNumber) {
        const level = LEVELS.find(l => l.number === levelNumber);
        return level ? level.characters : [];
    },

    /**
     * Get level info
     */
    getLevelInfo(levelNumber) {
        return LEVELS.find(l => l.number === levelNumber);
    },

    /**
     * Get all levels
     */
    getAllLevels() {
        return LEVELS;
    },

    /**
     * Get total number of characters
     */
    getTotalCharacters() {
        return Object.keys(THAI_CHARACTERS).length;
    },

    /**
     * Check if a character exists
     */
    isValidCharacter(char) {
        return char in THAI_CHARACTERS;
    },

    /**
     * Get characters by frequency
     */
    getCharactersByFrequency(frequency) {
        return Object.entries(THAI_CHARACTERS)
            .filter(([_, data]) => data.frequency === frequency)
            .map(([char, _]) => char);
    },

    /**
     * Find which level a character belongs to
     */
    getCharacterLevel(char) {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (LEVELS[i].characters.includes(char)) {
                return LEVELS[i].number;
            }
        }
        return null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THAI_CHARACTERS, LEVELS, ThaiData };
}

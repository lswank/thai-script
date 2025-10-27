/**
 * Thai Character Data Layer
 * Contains all Thai consonants with RTGS romanization and educational metadata
 */

// Thai Consonant Mappings with Educational Content
const THAI_CHARACTERS = {
    // Ko class
    'ก': {
        roman: 'k',
        class: 'mid',
        frequency: 'very-high',
        name: 'ko kai',
        explanation: 'Unaspirated K sound - no burst of air. Like "k" in "skill" or "sky". Say it without breathing out heavily.',
        mnemonic: 'ก looks like a chicken (kai means chicken) with a simple body and tail. The simplest K is unaspirated "k".',
        visualFeatures: ['Simple curved shape', 'Short tail that curves back', 'No extra loops or extensions', 'Most basic form in the K family'],
        confusesWith: ['ค', 'ข']
    },
    'ข': {
        roman: 'kh',
        class: 'high',
        frequency: 'high',
        name: 'kho khai',
        explanation: 'Aspirated KH - breathe out air strongly. The "h" shows aspiration. Like "k" in "key" with emphasis. Hold your hand in front of your mouth - you should feel air.',
        mnemonic: 'ข has a LOOPED tail like an egg (khai) sitting in a nest. The loop makes it fancier = aspirated "kh".',
        visualFeatures: ['Round loop at bottom right', 'Tail curves into itself', 'More complex than ก', 'Loop is key identifier'],
        confusesWith: ['ค', 'ก']
    },
    'ฃ': {
        roman: 'kh',
        class: 'high',
        frequency: 'rare',
        name: 'kho khuat',
        explanation: 'Aspirated KH - same sound as ข but rare/archaic. Almost never used in modern Thai.',
        mnemonic: 'ฃ has TWO BUMPS on top like a bottle (khuat). Rare character, rarely seen.',
        visualFeatures: ['Double bumps on top', 'Archaic form', 'Very rare in modern text', 'Similar to ข but with distinctive top'],
        confusesWith: ['ข', 'ค']
    },
    'ค': {
        roman: 'kh',
        class: 'low',
        frequency: 'high',
        name: 'kho khwai',
        explanation: 'Aspirated KH - same breathy sound as ข. Different tone class but same pronunciation. Strong air release.',
        mnemonic: 'ค has a STRAIGHT tail like a water buffalo (khwai) tail hanging straight down. Straight = strong aspirated "kh".',
        visualFeatures: ['Straight tail (not looped)', 'Vertical descent', 'Similar top to ก and ข', 'Tail is key difference'],
        confusesWith: ['ข', 'ก', 'ฃ']
    },
    'ฅ': {
        roman: 'kh',
        class: 'low',
        frequency: 'obsolete',
        name: 'kho khon',
        explanation: 'Obsolete character no longer used. Historically aspirated KH.',
        mnemonic: 'ฅ is basically dead - it\'s obsolete! You\'ll never see it in real Thai.',
        visualFeatures: ['Obsolete - not used', 'Similar to ค', 'Historical character only'],
        confusesWith: ['ค']
    },
    'ฆ': {
        roman: 'kh',
        class: 'low',
        frequency: 'low',
        name: 'kho rakhang',
        explanation: 'Aspirated KH - less common but still used. Same breathy K sound.',
        mnemonic: 'ฆ looks like a bell (rakhang) with loops. Ring the bell with aspiration - "kh"!',
        visualFeatures: ['Multiple loops', 'Complex structure', 'Double loop on right', 'Distinctive ornate appearance'],
        confusesWith: []
    },

    // Ngo
    'ง': {
        roman: 'ng',
        class: 'low',
        frequency: 'very-high',
        name: 'ngo ngu',
        explanation: 'NG sound like end of "sing" or "ring". Nasal sound from back of throat. NOT "n" + "g" separately.',
        mnemonic: 'ง looks like a snake (ngu) coiled up. Say "snaaaaake" and hold the "ng" sound.',
        visualFeatures: ['Circular body with tail', 'Looks like a coiled snake', 'Unique shape - hard to confuse', 'Closed circle on left'],
        confusesWith: []
    },

    // Cho class
    'จ': {
        roman: 'ch',
        class: 'mid',
        frequency: 'high',
        name: 'cho chan',
        explanation: 'Unaspirated CH - like "ch" in "nature" without strong air. Soft ch sound.',
        mnemonic: 'จ looks like a plate (chan) from the side. Simple plate = simple "ch".',
        visualFeatures: ['Flat top line', 'Curved bottom', 'Simple form', 'No extra decorations'],
        confusesWith: ['ฉ', 'ช']
    },
    'ฉ': {
        roman: 'ch',
        class: 'high',
        frequency: 'medium',
        name: 'cho ching',
        explanation: 'Aspirated CH - strong breathy "ch" like "church" with emphasis. Feel the air!',
        mnemonic: 'ฉ has an extra stroke/loop like cymbals (ching) clashing. Extra flourish = aspirated!',
        visualFeatures: ['Extra loop or stroke inside', 'More complex than จ', 'Internal decoration', 'Look for the extra mark'],
        confusesWith: ['จ', 'ช']
    },
    'ช': {
        roman: 'ch',
        class: 'low',
        frequency: 'high',
        name: 'cho chang',
        explanation: 'Aspirated CH - breathy ch sound. Very common in Thai words.',
        mnemonic: 'ช looks like an elephant (chang) with a trunk. Elephants are big = breathy "ch".',
        visualFeatures: ['Extended tail like trunk', 'Swooping curve', 'Long flowing bottom', 'Elephant trunk shape'],
        confusesWith: ['จ', 'ฉ', 'ซ']
    },
    'ซ': {
        roman: 's',
        class: 'low',
        frequency: 'medium',
        name: 'so so',
        explanation: 'S sound like "see" or "snake". Hissing sound.',
        mnemonic: 'ซ looks similar to ช but makes S sound. So-so character - it\'s s-s-simple!',
        visualFeatures: ['Similar to ช but slightly different curve', 'Closed loop pattern', 'Hissing snake shape'],
        confusesWith: ['ช']
    },
    'ฌ': {
        roman: 'ch',
        class: 'low',
        frequency: 'low',
        name: 'cho choe',
        explanation: 'Aspirated CH - less common, mostly in Sanskrit/Pali loanwords.',
        mnemonic: 'ฌ has a tree-like structure (choe = tree). Special/rare character.',
        visualFeatures: ['Tree-like branching', 'Complex ornate form', 'Multiple strokes', 'Distinctive Sanskrit origin'],
        confusesWith: []
    },

    // Yo class
    'ญ': {
        roman: 'y',
        class: 'low',
        frequency: 'medium',
        name: 'yo ying',
        explanation: 'Y sound like "yes" or "yellow". Mostly in formal/Sanskrit words.',
        mnemonic: 'ญ looks like a woman (ying) sitting. Elegant Y sound.',
        visualFeatures: ['Horizontal top line', 'Dangling descender', 'Formal appearance', 'Distinctive long tail'],
        confusesWith: ['ย']
    },

    // Do/To class
    'ฎ': {
        roman: 'd',
        class: 'mid',
        frequency: 'low',
        name: 'do chada',
        explanation: 'Unaspirated D - less common, mostly in Sanskrit words. Clean D sound.',
        mnemonic: 'ฎ has a headdress (chada) shape on top. Royal/formal D.',
        visualFeatures: ['Crown-like top', 'Ornate upper structure', 'Less common', 'Sanskrit origin'],
        confusesWith: ['ด']
    },
    'ฏ': {
        roman: 't',
        class: 'mid',
        frequency: 'low',
        name: 'to patak',
        explanation: 'Unaspirated T - formal/Sanskrit origin. Like "t" in "stop".',
        mnemonic: 'ฏ looks like a goad/hook (patak). Hook shape for T.',
        visualFeatures: ['Hook shape', 'Curved top', 'Formal character', 'Distinctive curve'],
        confusesWith: ['ต']
    },
    'ฐ': {
        roman: 'th',
        class: 'high',
        frequency: 'low',
        name: 'tho than',
        explanation: 'Aspirated TH - breathy T with air release. Base/pedestal words (than).',
        mnemonic: 'ฐ looks like a base/pedestal (than). Foundation character.',
        visualFeatures: ['Platform-like bottom', 'Formal structure', 'Less common', 'Sanskrit origin'],
        confusesWith: ['ถ', 'ท', 'ธ']
    },
    'ฑ': {
        roman: 'th',
        class: 'low',
        frequency: 'low',
        name: 'tho montho',
        explanation: 'Aspirated TH - formal, rare character. Breathy T sound.',
        mnemonic: 'ฑ is like a decorated elderly person (montho). Rare/respectful.',
        visualFeatures: ['Complex top decoration', 'Formal character', 'Ornate structure'],
        confusesWith: ['ฐ', 'ธ']
    },
    'ฒ': {
        roman: 'th',
        class: 'low',
        frequency: 'low',
        name: 'tho phu thao',
        explanation: 'Aspirated TH - rare, mostly in old/formal words. Elderly person character.',
        mnemonic: 'ฒ means old person (phu thao) - rarely used nowadays!',
        visualFeatures: ['Rare character', 'Complex form', 'Multiple components', 'Archaic appearance'],
        confusesWith: ['ฐ', 'ฑ']
    },
    'ณ': {
        roman: 'n',
        class: 'low',
        frequency: 'medium',
        name: 'no nen',
        explanation: 'N sound - formal/Sanskrit origin. Like "n" in "no".',
        mnemonic: 'ณ is the formal N (nen = novice monk). Used in formal Thai.',
        visualFeatures: ['Formal structure', 'Sanskrit origin', 'Distinctive from regular น'],
        confusesWith: ['น']
    },
    'ด': {
        roman: 'd',
        class: 'mid',
        frequency: 'very-high',
        name: 'do dek',
        explanation: 'Unaspirated D - super common! Like "d" in "do". No air burst.',
        mnemonic: 'ด looks like a child (dek) standing. Simple D for common use!',
        visualFeatures: ['Simple straight form', 'Vertical line with circle', 'Very common', 'Clean simple shape'],
        confusesWith: ['ต']
    },
    'ต': {
        roman: 't',
        class: 'mid',
        frequency: 'very-high',
        name: 'to tao',
        explanation: 'Unaspirated T - extremely common! Like "t" in "stop". Clean T sound.',
        mnemonic: 'ต looks like a turtle (tao) shell from above. Common as turtles!',
        visualFeatures: ['Rounded top', 'Simple form', 'Very common', 'Circular top component'],
        confusesWith: ['ด']
    },
    'ถ': {
        roman: 'th',
        class: 'high',
        frequency: 'high',
        name: 'tho thung',
        explanation: 'Aspirated TH - breathy T with air. Like "t" in "top" with emphasis.',
        mnemonic: 'ถ looks like a bag (thung) with handles. Breathe into the bag = "th"!',
        visualFeatures: ['Extended base', 'Handle-like top', 'Common character', 'Distinctive bottom extension'],
        confusesWith: ['ท', 'ธ']
    },
    'ท': {
        roman: 'th',
        class: 'low',
        frequency: 'high',
        name: 'tho thahan',
        explanation: 'Aspirated TH - very common breathy T. Like "th" in "Thailand"!',
        mnemonic: 'ท looks like a soldier (thahan) standing. Strong aspirated "th"!',
        visualFeatures: ['Rounded compact form', 'Common character', 'Clean circular top'],
        confusesWith: ['ถ', 'ธ']
    },
    'ธ': {
        roman: 'th',
        class: 'low',
        frequency: 'medium',
        name: 'tho thong',
        explanation: 'Aspirated TH - breathy T, less common than ท. Same sound.',
        mnemonic: 'ธ looks like a flag (thong). Wave the flag with breath = "th"!',
        visualFeatures: ['Horizontal line with extension', 'Flag-like shape', 'Less common than ท'],
        confusesWith: ['ถ', 'ท']
    },
    'น': {
        roman: 'n',
        class: 'low',
        frequency: 'very-high',
        name: 'no nu',
        explanation: 'N sound - super common! Like "n" in "no" or "nice". Simple nasal sound.',
        mnemonic: 'น looks like a mouse (nu) with a curled tail. N-n-nice mouse!',
        visualFeatures: ['Curled tail', 'Simple form', 'Very common', 'Mouse tail curve'],
        confusesWith: ['ณ']
    },

    // Bo/Po class
    'บ': {
        roman: 'b',
        class: 'mid',
        frequency: 'high',
        name: 'bo baimai',
        explanation: 'B sound like "bee" or "boy". Voiced B sound, not P.',
        mnemonic: 'บ looks like a leaf (baimai) on a stem. B for leaf!',
        visualFeatures: ['Simple rounded form', 'Leaf-like shape', 'Common character'],
        confusesWith: ['ป']
    },
    'ป': {
        roman: 'p',
        class: 'mid',
        frequency: 'very-high',
        name: 'po pla',
        explanation: 'Unaspirated P - very common! Like "p" in "spin". No air burst.',
        mnemonic: 'ป looks like a fish (pla) swimming. P for fish!',
        visualFeatures: ['Hook at bottom', 'Fish-like shape', 'Very common', 'Distinctive bottom hook'],
        confusesWith: ['บ']
    },
    'ผ': {
        roman: 'ph',
        class: 'high',
        frequency: 'high',
        name: 'pho phueng',
        explanation: 'Aspirated PH - breathy P with strong air. Like "p" in "pot". Feel the puff!',
        mnemonic: 'ผ looks like a bee (phueng). Bees buzz with air = "ph"!',
        visualFeatures: ['Split top', 'Forked appearance', 'Common character'],
        confusesWith: ['พ', 'ภ']
    },
    'ฝ': {
        roman: 'f',
        class: 'high',
        frequency: 'medium',
        name: 'fo fa',
        explanation: 'F sound like "fan" or "fun". Fricative sound - air through teeth.',
        mnemonic: 'ฝ has a lid (fa) on top. F for lid/cover!',
        visualFeatures: ['Top lid decoration', 'Distinctive top stroke', 'Box-like top'],
        confusesWith: ['ฟ']
    },
    'พ': {
        roman: 'ph',
        class: 'low',
        frequency: 'high',
        name: 'pho phan',
        explanation: 'Aspirated PH - breathy P, very common. Like "ph" in "phone".',
        mnemonic: 'พ looks like a tray (phan). Put it on the tray with breath = "ph"!',
        visualFeatures: ['Flat top', 'Tray-like shape', 'Very common'],
        confusesWith: ['ผ', 'ภ']
    },
    'ฟ': {
        roman: 'f',
        class: 'low',
        frequency: 'medium',
        name: 'fo fan',
        explanation: 'F sound like "free" or "fun". Teeth on lip fricative.',
        mnemonic: 'ฟ looks like teeth (fan). F sound uses teeth!',
        visualFeatures: ['Tooth-like serrations', 'Bottom decorations', 'Distinctive teeth'],
        confusesWith: ['ฝ']
    },
    'ภ': {
        roman: 'ph',
        class: 'low',
        frequency: 'medium',
        name: 'pho samphao',
        explanation: 'Aspirated PH - breathy P in formal words. Sail/junk words.',
        mnemonic: 'ภ looks like a sailing ship (samphao). Sail with wind = "ph"!',
        visualFeatures: ['Sail-like top', 'Ornate structure', 'Formal character'],
        confusesWith: ['ผ', 'พ']
    },
    'ม': {
        roman: 'm',
        class: 'low',
        frequency: 'very-high',
        name: 'mo ma',
        explanation: 'M sound like "mom" or "me". Lips together nasal sound.',
        mnemonic: 'ม looks like a horse (ma). M for horse - mmmmm!',
        visualFeatures: ['Wavy top', 'Horse mane-like', 'Very common', 'Distinctive wavy pattern'],
        confusesWith: []
    },

    // Yo/Ro/Lo class
    'ย': {
        roman: 'y',
        class: 'low',
        frequency: 'very-high',
        name: 'yo yak',
        explanation: 'Y sound like "yes" or "you". Very common in Thai.',
        mnemonic: 'ย looks like a giant (yak) with arms up. Y for giant!',
        visualFeatures: ['Arms-up shape', 'Y shape obvious', 'Very common', 'Simple form'],
        confusesWith: ['ญ']
    },
    'ร': {
        roman: 'r',
        class: 'low',
        frequency: 'very-high',
        name: 'ro ruea',
        explanation: 'R sound - very common! Rolled/flipped R in Thai (different from English R).',
        mnemonic: 'ร looks like a boat (ruea) from the front. R for boat!',
        visualFeatures: ['Boat prow shape', 'Angular form', 'Very common', 'Pointed top'],
        confusesWith: []
    },
    'ฤ': {
        roman: 'rue',
        class: 'low',
        frequency: 'low',
        name: 'rue',
        explanation: 'RUE sound - vowel+consonant combo. Like "r" + "uh" blended.',
        mnemonic: 'ฤ is special - it\'s a vowel-consonant! Rue the day you forget this one.',
        visualFeatures: ['Unique form', 'Vowel indicator', 'Rare character', 'Loop inside'],
        confusesWith: []
    },
    'ล': {
        roman: 'l',
        class: 'low',
        frequency: 'very-high',
        name: 'lo ling',
        explanation: 'L sound like "love" or "lie". Very common in Thai.',
        mnemonic: 'ล looks like a monkey (ling) hanging. L for monkey!',
        visualFeatures: ['Loop with tail', 'Monkey-like hanging shape', 'Very common'],
        confusesWith: []
    },
    'ฦ': {
        roman: 'lue',
        class: 'low',
        frequency: 'rare',
        name: 'lue',
        explanation: 'LUE sound - very rare vowel+consonant. Almost never seen.',
        mnemonic: 'ฦ is basically extinct - you\'ll rarely see it!',
        visualFeatures: ['Rare character', 'Similar to ฤ', 'Almost obsolete'],
        confusesWith: ['ฤ']
    },
    'ว': {
        roman: 'w',
        class: 'low',
        frequency: 'very-high',
        name: 'wo waen',
        explanation: 'W sound like "win" or "way". Very common in Thai.',
        mnemonic: 'ว looks like a ring (waen). W for ring!',
        visualFeatures: ['Ring/circle shape', 'Simple loop', 'Very common'],
        confusesWith: []
    },
    'ศ': {
        roman: 's',
        class: 'high',
        frequency: 'medium',
        name: 'so sala',
        explanation: 'S sound - formal/Sanskrit origin. Like "see" or "sun".',
        mnemonic: 'ศ looks like a pavilion (sala). Formal S!',
        visualFeatures: ['Ornate top', 'Formal character', 'Sanskrit origin'],
        confusesWith: ['ษ', 'ส']
    },
    'ษ': {
        roman: 's',
        class: 'high',
        frequency: 'medium',
        name: 'so rue si',
        explanation: 'S sound - formal Sanskrit character. Same hissing S sound.',
        mnemonic: 'ษ is the hermit (rue si) S - lives in formal Sanskrit words!',
        visualFeatures: ['Complex ornate form', 'Multiple components', 'Formal character'],
        confusesWith: ['ศ', 'ส']
    },
    'ส': {
        roman: 's',
        class: 'high',
        frequency: 'very-high',
        name: 'so suea',
        explanation: 'S sound - most common S! Like "snake" hissing - ssssss.',
        mnemonic: 'ส looks like a tiger (suea). Tiger hisses S!',
        visualFeatures: ['Wavy top', 'Common character', 'Tiger-like shape'],
        confusesWith: ['ศ', 'ษ']
    },

    // Ho class
    'ห': {
        roman: 'h',
        class: 'high',
        frequency: 'very-high',
        name: 'ho hip',
        explanation: 'H sound like "hello" or "house". Breathy sound from throat.',
        mnemonic: 'ห looks like a box/chest (hip). H for box!',
        visualFeatures: ['Box-like shape', 'Square form', 'Very common'],
        confusesWith: []
    },
    'ฬ': {
        roman: 'l',
        class: 'low',
        frequency: 'rare',
        name: 'lo chula',
        explanation: 'L sound - very rare, mostly in words related to Chulalongkorn University.',
        mnemonic: 'ฬ is the Chula L - named after the university! Rare character.',
        visualFeatures: ['Rare character', 'Ornate form', 'Almost never seen'],
        confusesWith: ['ล']
    },
    'อ': {
        roman: 'o',
        class: 'mid',
        frequency: 'very-high',
        name: 'o ang',
        explanation: 'Silent consonant OR "o" sound. Acts as vowel carrier. Like "o" in "go".',
        mnemonic: 'อ looks like a basin (ang). Open O shape = O sound!',
        visualFeatures: ['Bowl/basin shape', 'Open circular form', 'Very common', 'Vowel carrier'],
        confusesWith: []
    },
    'ฮ': {
        roman: 'h',
        class: 'low',
        frequency: 'medium',
        name: 'ho nokhuk',
        explanation: 'H sound - less common than ห. Breathy H like "ha".',
        mnemonic: 'ฮ looks like an owl (nokhuk). Owl hoots H!',
        visualFeatures: ['Owl-like shape', 'Less common than ห', 'Curved form'],
        confusesWith: ['ห']
    }
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
    },

    /**
     * Get characters that are confused with this one
     */
    getConfusedCharacters(char) {
        const data = THAI_CHARACTERS[char];
        return data?.confusesWith || [];
    },

    /**
     * Get explanation for a character
     */
    getExplanation(char) {
        return THAI_CHARACTERS[char]?.explanation || '';
    },

    /**
     * Get mnemonic for a character
     */
    getMnemonic(char) {
        return THAI_CHARACTERS[char]?.mnemonic || '';
    },

    /**
     * Get visual features for a character
     */
    getVisualFeatures(char) {
        return THAI_CHARACTERS[char]?.visualFeatures || [];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THAI_CHARACTERS, LEVELS, ThaiData };
}

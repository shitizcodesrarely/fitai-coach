// ── Session volume rank titles ─────────────────────────────────────────────
// Shown on post-workout screen based on kg lifted in that session

export const SESSION_RANKS = [
  {
    min: 0,
    max: 300,
    title: "Initiate",
    universe: "Warhammer 40K",
    emoji: "🐺",
    line: "You lifted a hungry wolf cub",
    yodaQuote: "Just beginning, you are. The iron path is long, young Padawan.",
  },
  {
    min: 300,
    max: 600,
    title: "Scout Marine",
    universe: "Warhammer 40K",
    emoji: "🎹",
    line: "You lifted a grand piano",
    yodaQuote: "Enhanced you become. Feel the difference, do you?",
  },
  {
    min: 600,
    max: 1000,
    title: "Space Marine",
    universe: "Warhammer 40K",
    emoji: "🐻",
    line: "You lifted a polar bear in full armour",
    yodaQuote: "Superhuman strength, you show. Proud, I am.",
  },
  {
    min: 1000,
    max: 2000,
    title: "War Machine",
    universe: "Marvel",
    emoji: "🚗",
    line: "You lifted a family car with the engine",
    yodaQuote: "Iron suit, you need not. Iron will, you already have.",
  },
  {
    min: 2000,
    max: 3500,
    title: "Colossus",
    universe: "X-Men",
    emoji: "🐘",
    line: "You lifted an elephant",
    yodaQuote: "Organic steel, your muscles become. Hmmm, yes.",
  },
  {
    min: 3500,
    max: 5000,
    title: "Juggernaut",
    universe: "Marvel",
    emoji: "🦕",
    line: "Nothing stopped you. You lifted a T-Rex",
    yodaQuote: "Unstoppable, you are. Nothing can stop you now, hmmm.",
  },
  {
    min: 5000,
    max: 8000,
    title: "Kratos",
    universe: "God of War",
    emoji: "🐋",
    line: "You killed the gods. You lifted a humpback whale",
    yodaQuote: "Killed gods, Kratos has. Matched him, you have. BOY.",
  },
  {
    min: 8000,
    max: 12000,
    title: "Thor Odinson",
    universe: "Marvel/Norse",
    emoji: "🚀",
    line: "Worthy. You lifted a space shuttle",
    yodaQuote: "Worthy you are. Mjolnir, pick it up you could. Hmmm.",
  },
  {
    min: 12000,
    max: 20000,
    title: "Primarch",
    universe: "Warhammer 40K",
    emoji: "🗼",
    line: "Demigod. You lifted the Eiffel Tower",
    yodaQuote: "A demigod, you have become. Transcended human limits, you have.",
  },
  {
    min: 20000,
    max: 50000,
    title: "Chaos God",
    universe: "Warhammer 40K",
    emoji: "⚓",
    line: "Reality bends. You lifted a destroyer warship",
    yodaQuote: "A deity you approach. Fear you, reality does. Hmmm.",
  },
  {
    min: 50000,
    max: Infinity,
    title: "The One Above All",
    universe: "Marvel",
    emoji: "🌌",
    line: "You are the gym",
    yodaQuote: "Words, I have none. The Force itself bows to you.",
  },
];

// ── All-time total volume titles ───────────────────────────────────────────
// Shown on profile page based on total kg lifted since joining

export const ALLTIME_RANKS = [
  { min: 0,        max: 5000,     title: "Neophyte",          universe: "Warhammer 40K", flavour: "Your journey begins, Brother" },
  { min: 5000,     max: 15000,    title: "Battle Brother",    universe: "Warhammer 40K", flavour: "The iron forge awaits" },
  { min: 15000,    max: 30000,    title: "Iron Hand",         universe: "Warhammer 40K", flavour: "Flesh is weak. Iron is eternal" },
  { min: 30000,    max: 60000,    title: "Mjolnir Worthy",    universe: "Norse/Marvel",  flavour: "Few are worthy. You are one" },
  { min: 60000,    max: 100000,   title: "Incredible",        universe: "Marvel",        flavour: "You wouldn't like yourself when angry" },
  { min: 100000,   max: 200000,   title: "Vibranium Class",   universe: "Marvel",        flavour: "Wakanda Forever, King" },
  { min: 200000,   max: 500000,   title: "Astartes",          universe: "Warhammer 40K", flavour: "A transhuman killing machine" },
  { min: 500000,   max: 1000000,  title: "Daemon Prince",     universe: "Warhammer 40K", flavour: "Ascended beyond mortal limits" },
  { min: 1000000,  max: Infinity, title: "Emperor's Champion",universe: "Warhammer 40K", flavour: "There is only war. And you won it" },
];

// ── XP level titles ────────────────────────────────────────────────────────
// Shown on profile and leaderboard

export const LEVEL_TITLES = [
  { minLevel: 1,  maxLevel: 3,  title: "Uninitiated",   universe: "Warhammer 40K" },
  { minLevel: 4,  maxLevel: 6,  title: "Recruit",       universe: "Warhammer 40K" },
  { minLevel: 7,  maxLevel: 10, title: "Scout",         universe: "Warhammer 40K" },
  { minLevel: 11, maxLevel: 15, title: "Battle Brother",universe: "Warhammer 40K" },
  { minLevel: 16, maxLevel: 20, title: "Sergeant",      universe: "Warhammer 40K" },
  { minLevel: 21, maxLevel: 25, title: "Mutant",        universe: "X-Men"         },
  { minLevel: 26, maxLevel: 30, title: "X-Man",         universe: "X-Men"         },
  { minLevel: 31, maxLevel: 35, title: "Avenger",       universe: "Marvel"        },
  { minLevel: 36, maxLevel: 40, title: "Infinity Class",universe: "Marvel"        },
  { minLevel: 41, maxLevel: 45, title: "Primarch",      universe: "Warhammer 40K" },
  { minLevel: 46, maxLevel: 49, title: "Daemon Prince", universe: "Warhammer 40K" },
  { minLevel: 50, maxLevel: 50, title: "The Emperor",   universe: "Warhammer 40K" },
];

// ── XP needed per level ────────────────────────────────────────────────────
// Each level needs more XP than the last — like a real game
export const XP_PER_LEVEL = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000,
  5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000, 26000,
  30500, 35500, 41000, 47000, 54000, 62000, 71000, 81000, 92000, 104000,
];

// ── Streak flavour text (Yoda style) ──────────────────────────────────────
export const STREAK_QUOTES = [
  { days: 3,   text: "The Burning Crusade begins, young Padawan" },
  { days: 7,   text: "Oath of Moment — sworn and kept, it is" },
  { days: 14,  text: "Two weeks. Quit, the weak already have" },
  { days: 21,  text: "A habit forged in iron, this is" },
  { days: 30,  text: "Eternal Warrior. Fear you, the gym does" },
  { days: 60,  text: "Even the Chaos Gods take note, hmmm" },
  { days: 100, text: "The Emperor smiles upon you, yes" },
];

// ── Helper functions ───────────────────────────────────────────────────────

export function getSessionRank(volumeKg) {
  return SESSION_RANKS.find((r) => volumeKg >= r.min && volumeKg < r.max) ?? SESSION_RANKS[0];
}

export function getAlltimeRank(totalVolumeKg) {
  return ALLTIME_RANKS.find((r) => totalVolumeKg >= r.min && totalVolumeKg < r.max) ?? ALLTIME_RANKS[0];
}

export function getLevelTitle(level) {
  return LEVEL_TITLES.find((t) => level >= t.minLevel && level <= t.maxLevel) ?? LEVEL_TITLES[0];
}

export function getXpForLevel(level) {
  return XP_PER_LEVEL[Math.min(level, XP_PER_LEVEL.length - 1)] ?? 999999;
}

export function getStreakQuote(streak) {
  const sorted = [...STREAK_QUOTES].reverse();
  return sorted.find((q) => streak >= q.days)?.text ?? null;
}

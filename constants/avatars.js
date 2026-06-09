// Avatar system constants

// ── 5 base body types ─────────────────────────────────────────────────────
export const BODY_TYPES = [
  {
    id:          "alpha",
    name:        "Alpha",
    description: "Big, blocky, wide shoulders",
  },
  {
    id:          "aesthetic",
    name:        "Aesthetic",
    description: "Lean, V-taper, defined",
  },
  {
    id:          "powerhouse",
    name:        "Powerhouse",
    description: "Short, thick, massive legs",
  },
  {
    id:          "shredded",
    name:        "Shredded",
    description: "Tall, ripped, visible abs",
  },
  {
    id:          "rookie",
    name:        "Rookie",
    description: "Average build, just starting",
  },
];

// ── Customization options ─────────────────────────────────────────────────
export const SKIN_TONES = [
  "#FDDBB4", "#F5C89A", "#E8A87C", "#D4855A",
  "#C06C3A", "#8D5524", "#6B3E1E", "#4A2010",
];

export const HAIR_STYLES = [
  { id: "buzz",     name: "Buzz Cut"   },
  { id: "mohawk",   name: "Mohawk"     },
  { id: "dreads",   name: "Dreads"     },
  { id: "bald",     name: "Bald"       },
  { id: "long",     name: "Long"       },
  { id: "fade",     name: "Fade"       },
  { id: "curly",    name: "Curly"      },
];

export const BEARD_STYLES = [
  { id: "clean",    name: "Clean"      },
  { id: "stubble",  name: "Stubble"    },
  { id: "full",     name: "Full Beard" },
  { id: "goatee",   name: "Goatee"     },
  { id: "mustache", name: "Mustache"   },
];

export const OUTFIT_TOPS = [
  { id: "tank",        name: "Tank Top"          },
  { id: "hoodie",      name: "Hoodie"            },
  { id: "compression", name: "Compression Shirt" },
  { id: "noshirt",     name: "No Shirt"          },
];

export const OUTFIT_BOTTOMS = [
  { id: "joggers",  name: "Joggers"  },
  { id: "shorts",   name: "Shorts"   },
  { id: "tights",   name: "Tights"   },
];

export const ACCESSORIES = [
  { id: "none",       name: "None"        },
  { id: "headband",   name: "Headband"    },
  { id: "headphones", name: "Headphones"  },
  { id: "belt",       name: "Belt"        },
  { id: "wristbands", name: "Wristbands"  },
];

// ── Avatar upgrades by level ──────────────────────────────────────────────
// As user levels up, avatar visually grows
export const AVATAR_LEVEL_UPGRADES = [
  { minLevel: 1,  maxLevel: 5,  label: "Novice",  scale: 1.0,  muscleClass: "muscle-1" },
  { minLevel: 6,  maxLevel: 15, label: "Grinder", scale: 1.05, muscleClass: "muscle-2" },
  { minLevel: 16, maxLevel: 25, label: "Athlete", scale: 1.1,  muscleClass: "muscle-3" },
  { minLevel: 26, maxLevel: 35, label: "Beast",   scale: 1.15, muscleClass: "muscle-4" },
  { minLevel: 36, maxLevel: 45, label: "Elite",   scale: 1.2,  muscleClass: "muscle-5" },
  { minLevel: 46, maxLevel: 50, label: "Legend",  scale: 1.3,  muscleClass: "muscle-6" },
];

// ── Fitness legends ────────────────────────────────────────────────────────
// Pixel art illustrated versions (not real photos — stylised)
export const FITNESS_LEGENDS = {
  oldSchool: [
    { id: "arnold",  name: "Arnold Schwarzenegger", era: "Golden Era",    icon: "💪" },
    { id: "ronnie",  name: "Ronnie Coleman",        era: "Mass Monster",  icon: "👊" },
    { id: "zane",    name: "Frank Zane",            era: "Aesthetics",    icon: "⚡" },
    { id: "lou",     name: "Lou Ferrigno",          era: "Golden Era",    icon: "🟢" },
    { id: "dorian",  name: "Dorian Yates",          era: "Blood & Guts",  icon: "🩸" },
    { id: "haney",   name: "Lee Haney",             era: "8x Olympia",    icon: "🏆" },
    { id: "franco",  name: "Franco Columbu",        era: "Golden Era",    icon: "🌟" },
  ],
  newSchool: [
    { id: "cbum",    name: "Chris Bumstead",        era: "Classic Physique", icon: "👑" },
    { id: "sulek",   name: "Sam Sulek",             era: "Raw & Unfiltered", icon: "🎧" },
    { id: "noel",    name: "Noel Deyzel",           era: "Gentle Giant",     icon: "🤝" },
    { id: "nippard", name: "Jeff Nippard",          era: "Science Based",    icon: "🔬" },
    { id: "laid",    name: "David Laid",            era: "Aesthetics",       icon: "✨" },
  ],
};

export function getAvatarUpgrade(level) {
  return (
    AVATAR_LEVEL_UPGRADES.find((u) => level >= u.minLevel && level <= u.maxLevel) ??
    AVATAR_LEVEL_UPGRADES[0]
  );
}

export function getDefaultAvatarData() {
  return {
    type:       "custom",
    bodyType:   "rookie",
    skinTone:   "#F5C89A",
    hair:       "buzz",
    beard:      "clean",
    outfitTop:  "tank",
    outfitBottom: "shorts",
    accessory:  "none",
  };
}

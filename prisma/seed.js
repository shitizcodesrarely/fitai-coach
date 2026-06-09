// Run this once after migrate to populate the Badge table
// Command: node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BADGES = [
  { key: "gene_seed_activated",  name: "Gene-Seed Activated",    description: "Completed onboarding.",                 universe: "Warhammer 40K",  icon: "🧬", xpReward: 100 },
  { key: "baptism_of_iron",      name: "Baptism of Iron",         description: "Completed first workout.",              universe: "Warhammer 40K",  icon: "🩸", xpReward: 150 },
  { key: "burning_crusade",      name: "The Burning Crusade",     description: "3 day workout streak.",                 universe: "Warhammer 40K",  icon: "🔥", xpReward: 200 },
  { key: "oath_of_moment",       name: "Oath of Moment",          description: "7 day workout streak.",                 universe: "Warhammer 40K",  icon: "⚔️", xpReward: 500 },
  { key: "eternal_warrior",      name: "Eternal Warrior",         description: "30 day workout streak.",                universe: "Marvel",         icon: "🧠", xpReward: 2000 },
  { key: "hundred_worlds",       name: "Hundred Worlds",          description: "100 total sessions.",                   universe: "Warhammer 40K",  icon: "🏛️", xpReward: 3000 },
  { key: "whale_shark_protocol", name: "Whale Shark Protocol",    description: "Lifted 1,000kg in one session.",        universe: "FitAI Original", icon: "🦈", xpReward: 500 },
  { key: "mjolnir_lift",         name: "Mjolnir Lift",            description: "New personal best on any exercise.",    universe: "Norse/Marvel",   icon: "👑", xpReward: 200 },
  { key: "dawn_crusader",        name: "Dawn Crusader",           description: "Logged a workout before 7am.",          universe: "Warhammer 40K",  icon: "🌅", xpReward: 150 },
  { key: "night_lords",          name: "Night Lords",             description: "Logged a workout after 10pm.",          universe: "Warhammer 40K",  icon: "🌙", xpReward: 150 },
  { key: "servo_skull_vision",   name: "Servo-Skull Vision",      description: "Uploaded first form check video.",      universe: "Warhammer 40K",  icon: "🎥", xpReward: 200 },
  { key: "leviathan_class",      name: "Leviathan Class",         description: "Lifted 10,000kg total.",                universe: "Warhammer 40K",  icon: "🌊", xpReward: 1000 },
  { key: "unbroken_chain",       name: "Unbroken Chain",          description: "4 workouts in one week.",               universe: "Warhammer 40K",  icon: "💎", xpReward: 300 },
  { key: "eye_of_empyrean",      name: "Eye of the Empyrean",     description: "Received AI form check feedback.",      universe: "Warhammer 40K",  icon: "👁️", xpReward: 200 },
];

async function main() {
  console.log("Seeding badges...");
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where:  { key: badge.key },
      update: badge,
      create: badge,
    });
    console.log(`  ✓ ${badge.name}`);
  }
  console.log("Done! All badges seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

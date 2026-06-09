// All Yoda quotes organized by context
// Star Wars Yoda personality — inverted sentences, wise, cryptic

export const YODA_QUOTES = {
  // Onboarding
  welcome:          "Train you, I will. Ready, are you, young Padawan?",
  askName:          "Your name, tell me. Important, a name is.",
  askGoal:          "What you seek, hmm? The path, choose carefully you must.",
  askExperience:    "How long on the iron path, have you walked?",
  askDays:          "Commitment, the first step it is. How many days, give you can?",
  askEquipment:     "Your weapons, show me. With what, train you will?",
  askStats:         "Your vessel, assess we must. Numbers, tell the truth they do.",
  askAvatar:        "Your warrior form, choose. Face your battles with, this avatar you will.",
  generatingPlan:   "Forging your destiny, I am. Patient, be.",
  planReady:        "Ready, your plan is. The iron awaits, young Padawan.",

  // Workout
  workoutStart:     "Begin, we must. Wait for no one, the iron does.",
  setLogged:        "Strong, that set was. Continue, you must.",
  restTimer:        "Rest, you must. Recovery, part of the path it is.",
  workoutComplete:  "Finished, you have. Proud, I am, young Padawan.",
  newPR:            "A personal record! Hmmm. Powerful, you have become.",
  skipRest:         "Rush you should not. Injury, the dark side of training it is.",

  // Streaks
  streak3:          "Three days. The Burning Crusade begins, yes.",
  streak7:          "Seven days. The Oath of Moment, kept it is.",
  streak14:         "Two weeks. Quit, the weak already have.",
  streak30:         "Thirty days. An Eternal Warrior, you become.",
  streakBroken:     "Lost your way, you have. Return, you must. Disappointed, I am.",
  streakRestart:    "Begin again, you do. Stronger for it, you will be.",

  // Badges
  newBadge:         "Earned this, you have. The Force is strong in you.",
  firstBadge:       "Your first honour. Many more, await you.",

  // Levels
  levelUp:          "Grown stronger, you have. Feel it, I do. Hmmm.",
  maxLevel:         "The Emperor himself, could not be more proud.",

  // General motivation
  motivation1:      "Do or do not. There is no try. In the gym, especially.",
  motivation2:      "Size matters not. Look at me. Judge me by my size, do you?",
  motivation3:      "The greatest teacher, failure is. Miss a set, fear not.",
  motivation4:      "Patience you must have, young Padawan. Gains come not overnight.",
  motivation5:      "Always pass on what you have learned. Except leg day. Skip that, no one should.",

  // Idle (random, shown when user clicks Yoda on dashboard)
  idle: [
    "Hmmmm. Something on your mind, is there?",
    "Train today, will you? Waiting, the iron is.",
    "Strong you are. Stronger, you will become.",
    "Rest day today? Good. Recovery, underestimate you should not.",
    "Checked your progress, have you? Illuminate your path, numbers do.",
    "Proud of you, I am. Said it I did, and mean it I do.",
  ],
};

export function getRandomIdleQuote() {
  const quotes = YODA_QUOTES.idle;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

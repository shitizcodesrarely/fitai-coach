import { z } from "zod";

// Reproduce the same schemas used in API routes so we can test them in isolation

const signupSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
});

const workoutProfileSchema = z.object({
  age:         z.number().min(13).max(80),
  weightKg:    z.number().min(30).max(300),
  heightCm:    z.number().min(100).max(250),
  goal:        z.enum(["BULK", "CUT", "MAINTAIN", "STRENGTH", "ENDURANCE"]),
  experience:  z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  daysPerWeek: z.number().min(2).max(6),
  equipment:   z.string(),
});

// ─── Signup schema ───────────────────────────────────────────────────────────
describe("Signup schema", () => {
  const valid = { name: "Rahul Kumar", email: "rahul@example.com", password: "secure123" };

  test("accepts valid input", () => {
    expect(() => signupSchema.parse(valid)).not.toThrow();
  });

  test("rejects name under 2 chars", () => {
    expect(() => signupSchema.parse({ ...valid, name: "R" })).toThrow();
  });

  test("rejects invalid email", () => {
    expect(() => signupSchema.parse({ ...valid, email: "notanemail" })).toThrow();
  });

  test("rejects password under 8 chars", () => {
    expect(() => signupSchema.parse({ ...valid, password: "short" })).toThrow();
  });
});

// ─── Workout profile schema ──────────────────────────────────────────────────
describe("Workout profile schema", () => {
  const valid = {
    age: 22, weightKg: 75, heightCm: 175,
    goal: "BULK", experience: "BEGINNER",
    daysPerWeek: 4, equipment: "Barbell, Dumbbells",
  };

  test("accepts valid input", () => {
    expect(() => workoutProfileSchema.parse(valid)).not.toThrow();
  });

  test("rejects age below 13", () => {
    expect(() => workoutProfileSchema.parse({ ...valid, age: 10 })).toThrow();
  });

  test("rejects age above 80", () => {
    expect(() => workoutProfileSchema.parse({ ...valid, age: 90 })).toThrow();
  });

  test("rejects invalid goal", () => {
    expect(() => workoutProfileSchema.parse({ ...valid, goal: "LOSE_WEIGHT" })).toThrow();
  });

  test("rejects days per week above 6", () => {
    expect(() => workoutProfileSchema.parse({ ...valid, daysPerWeek: 7 })).toThrow();
  });

  test("rejects days per week below 2", () => {
    expect(() => workoutProfileSchema.parse({ ...valid, daysPerWeek: 1 })).toThrow();
  });

  test("all valid goals are accepted", () => {
    const goals = ["BULK", "CUT", "MAINTAIN", "STRENGTH", "ENDURANCE"];
    goals.forEach((goal) => {
      expect(() => workoutProfileSchema.parse({ ...valid, goal })).not.toThrow();
    });
  });

  test("all valid experience levels are accepted", () => {
    const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    levels.forEach((experience) => {
      expect(() => workoutProfileSchema.parse({ ...valid, experience })).not.toThrow();
    });
  });
});

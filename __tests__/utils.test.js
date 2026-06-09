import {
  cn,
  formatWeight,
  calculateBMI,
  calculateVolume,
  formatDuration,
  safeJsonParse,
} from "@/lib/utils";

describe("cn (classname merger)", () => {
  test("merges multiple classes", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  test("handles falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  test("handles conditional objects", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});

describe("formatWeight", () => {
  test("formats weight with kg suffix", () => {
    expect(formatWeight(75)).toBe("75kg");
    expect(formatWeight(100.5)).toBe("100.5kg");
  });
});

describe("calculateBMI", () => {
  test("calculates BMI correctly", () => {
    expect(calculateBMI(70, 175)).toBe("22.9");
    expect(calculateBMI(90, 180)).toBe("27.8");
  });

  test("returns string", () => {
    expect(typeof calculateBMI(70, 175)).toBe("string");
  });
});

describe("calculateVolume", () => {
  test("sums reps × weightKg across logs", () => {
    const logs = [
      { reps: 10, weightKg: 60 }, // 600
      { reps: 8,  weightKg: 70 }, // 560
      { reps: 6,  weightKg: 80 }, // 480
    ];
    expect(calculateVolume(logs)).toBe(1640);
  });

  test("returns 0 for empty logs", () => {
    expect(calculateVolume([])).toBe(0);
  });
});

describe("formatDuration", () => {
  test("formats minutes under 1 hour", () => {
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(30)).toBe("30m");
  });

  test("formats minutes over 1 hour", () => {
    expect(formatDuration(90)).toBe("1h 30m");
    expect(formatDuration(120)).toBe("2h 0m");
  });

  test("returns dash for null/undefined", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(undefined)).toBe("—");
  });
});

describe("safeJsonParse", () => {
  test("parses valid JSON", () => {
    expect(safeJsonParse('{"key":"value"}')).toEqual({ key: "value" });
    expect(safeJsonParse("[1,2,3]")).toEqual([1, 2, 3]);
  });

  test("returns null for invalid JSON", () => {
    expect(safeJsonParse("not json")).toBeNull();
    expect(safeJsonParse("{broken")).toBeNull();
    expect(safeJsonParse(undefined)).toBeNull();
  });
});

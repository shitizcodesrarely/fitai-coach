"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import MasterYoda from "@/components/yoda/MasterYoda";
import AvatarPicker from "@/components/avatar/AvatarPicker";
import { YODA_QUOTES } from "@/constants/yoda";

const TOTAL_STEPS = 9;

const GOALS = [
  { value: "BULK",      label: "Build Muscle",      emoji: "🏋️" },
  { value: "CUT",       label: "Lose Fat",           emoji: "🔥" },
  { value: "MAINTAIN",  label: "Stay Fit",           emoji: "⚡" },
  { value: "STRENGTH",  label: "Get Stronger",       emoji: "💪" },
  { value: "ENDURANCE", label: "Improve Endurance",  emoji: "🏃" },
];

const EXPERIENCE_LEVELS = [
  { value: "BEGINNER",     label: "Beginner",     sub: "Under 1 year",  emoji: "🌱" },
  { value: "INTERMEDIATE", label: "Intermediate", sub: "1–3 years",     emoji: "⚔️" },
  { value: "ADVANCED",     label: "Advanced",     sub: "3+ years",      emoji: "🔱" },
];

const EQUIPMENT_OPTIONS = [
  "Barbell", "Dumbbells", "Cables", "Machines",
  "Pull-up bar", "Resistance bands", "Bodyweight only",
];

export default function OnboardingFlow() {
  const router   = useRouter();
  const [step, setStep]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "", age: "", weightKg: "", heightCm: "",
    goal: "", experience: "", daysPerWeek: 4,
    equipment: [], avatarData: null,
  });

  const yodaMoods = ["happy", "idle", "thinking", "idle", "idle", "idle", "idle", "idle", "happy"];
  const yodaQuotes = [
    YODA_QUOTES.welcome, YODA_QUOTES.askName, YODA_QUOTES.askAvatar,
    YODA_QUOTES.askGoal, YODA_QUOTES.askExperience,
    YODA_QUOTES.askDays, YODA_QUOTES.askEquipment,
    YODA_QUOTES.askStats, YODA_QUOTES.generatingPlan,
  ];

  function next()  { setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); }
  function back()  { setStep((s) => Math.max(s - 1, 0)); }

  function toggleEquipment(item) {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      await fetch("/api/user/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age:         parseInt(form.age),
          weightKg:    parseFloat(form.weightKg),
          heightCm:    parseFloat(form.heightCm),
          goal:        form.goal,
          experience:  form.experience,
          daysPerWeek: form.daysPerWeek,
          equipment:   form.equipment.join(", "),
        }),
      });

      if (form.avatarData) {
        await fetch("/api/avatar", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarData: form.avatarData }),
        });
      }

      // Generate AI workout plan
      await fetch("/api/workout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age:         parseInt(form.age),
          weightKg:    parseFloat(form.weightKg),
          heightCm:    parseFloat(form.heightCm),
          goal:        form.goal,
          experience:  form.experience,
          daysPerWeek: form.daysPerWeek,
          equipment:   form.equipment.join(", "),
        }),
      });

      router.push("/dashboard?welcome=true");
    } catch (e) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: "var(--bg-secondary)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "var(--accent)" }}
          />
        </div>
      </div>

      {/* Yoda */}
      <div className="mb-6">
        <MasterYoda
          mood={yodaMoods[step]}
          quote={yodaQuotes[step]}
          size={90}
          showBubble={true}
        />
      </div>

      {/* Step content */}
      <div className="w-full max-w-md">
        {error && (
          <div
            className="mb-4 p-3 rounded-xl text-sm text-center"
            style={{ background: "#fee2e2", color: "#991b1b" }}
          >
            {error}
          </div>
        )}

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Your journey begins
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Train you, I will. Answer a few questions, you must.
            </p>
            <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: "var(--accent)" }}>
              Begin Training ⚔️
            </button>
          </div>
        )}

        {/* Step 1 — Name */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
              What do they call you, warrior?
            </h2>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-lg mb-4 focus:outline-none"
              style={{
                background: "var(--bg-secondary)",
                border: "1.5px solid var(--border)",
                color: "var(--text-primary)",
              }}
              autoFocus
            />
            <button
              onClick={next}
              disabled={!form.name.trim()}
              className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Avatar */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>
              Choose your warrior form
            </h2>
            <AvatarPicker
              onSelect={(data) => { setForm({ ...form, avatarData: data }); next(); }}
              onSkip={next}
            />
          </div>
        )}

        {/* Step 3 — Goal */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
              What do you seek?
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => { setForm({ ...form, goal: g.value }); next(); }}
                  className="flex flex-col items-center p-4 rounded-xl transition-all"
                  style={{
                    background: form.goal === g.value ? "var(--accent-light)" : "var(--bg-secondary)",
                    border: `2px solid ${form.goal === g.value ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  <span className="text-3xl mb-2">{g.emoji}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Experience */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
              How long on the iron path?
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              {EXPERIENCE_LEVELS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => { setForm({ ...form, experience: e.value }); next(); }}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all"
                  style={{
                    background: form.experience === e.value ? "var(--accent-light)" : "var(--bg-secondary)",
                    border: `2px solid ${form.experience === e.value ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  <span className="text-3xl">{e.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{e.label}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{e.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 — Days per week */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-center" style={{ color: "var(--text-primary)" }}>
              How many days can you commit?
            </h2>
            <p className="text-center text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Commitment, the first step it is.
            </p>
            <div className="flex justify-center mb-4">
              <span className="text-6xl font-bold" style={{ color: "var(--accent)" }}>
                {form.daysPerWeek}
              </span>
              <span className="text-2xl self-end ml-2 mb-2" style={{ color: "var(--text-secondary)" }}>
                days
              </span>
            </div>
            <input
              type="range" min={2} max={6} value={form.daysPerWeek}
              onChange={(e) => setForm({ ...form, daysPerWeek: parseInt(e.target.value) })}
              className="w-full mb-6 accent-green-600"
            />
            <div className="flex justify-between text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
              <span>2 days</span><span>6 days</span>
            </div>
            <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: "var(--accent)" }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 6 — Equipment */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
              What weapons do you have?
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {EQUIPMENT_OPTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleEquipment(item)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: form.equipment.includes(item) ? "var(--accent)" : "var(--bg-secondary)",
                    color:      form.equipment.includes(item) ? "#fff" : "var(--text-secondary)",
                    border:     `1px solid ${form.equipment.includes(item) ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={form.equipment.length === 0}
              className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 7 — Body stats */}
        {step === 7 && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-center" style={{ color: "var(--text-primary)" }}>
              Let us assess your vessel
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Numbers, tell the truth they do.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { field: "age",      label: "Age",        placeholder: "22",  unit: "yrs" },
                { field: "weightKg", label: "Weight",     placeholder: "75",  unit: "kg"  },
                { field: "heightCm", label: "Height",     placeholder: "175", unit: "cm"  },
              ].map(({ field, label, placeholder, unit }) => (
                <div key={field}>
                  <label className="block text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full rounded-xl px-3 py-2 text-center text-lg focus:outline-none"
                      style={{
                        background: "var(--bg-secondary)",
                        border:     "1.5px solid var(--border)",
                        color:      "var(--text-primary)",
                      }}
                    />
                    <span
                      className="absolute right-2 bottom-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!form.age || !form.weightKg || !form.heightCm}
              className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 8 — Generate plan */}
        {step === 8 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Ready, your plan is
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Forge your destiny, Claude AI will. Begin, shall we?
            </p>
            <div className="rounded-xl p-4 mb-6 text-left" style={{ background: "var(--bg-secondary)" }}>
              {[
                { label: "Name",      value: form.name },
                { label: "Goal",      value: form.goal?.toLowerCase() },
                { label: "Level",     value: form.experience?.toLowerCase() },
                { label: "Days/week", value: `${form.daysPerWeek} days` },
                { label: "Equipment", value: form.equipment.slice(0,3).join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <span className="text-xs font-medium capitalize" style={{ color: "var(--text-primary)" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-lg disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Forging your plan..." : "Generate my plan ✨"}
            </button>
            <button onClick={back} className="mt-3 text-sm w-full"
              style={{ color: "var(--text-secondary)" }}>
              ← Go back
            </button>
          </div>
        )}

        {/* Back button for steps 1-7 */}
        {step >= 1 && step <= 7 && (
          <button
            onClick={back}
            className="mt-4 text-sm w-full text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

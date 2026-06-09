"use client";
import { useState, useEffect, useRef } from "react";
import PostWorkoutScreen from "@/components/gamification/PostWorkoutScreen";

export default function WorkoutLogger({ plan, userId }) {
  const planData = typeof plan.planData === "string"
    ? JSON.parse(plan.planData) : plan.planData;

  const allDays  = planData.weeks.flatMap((w) => w.days);
  const [dayIdx, setDayIdx]       = useState(0);
  const [logs, setLogs]           = useState({});
  const [timer, setTimer]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [result, setResult]       = useState(null);   // post-workout result
  const [startTime]               = useState(Date.now());
  const timerRef                  = useRef(null);

  const day = allDays[dayIdx];

  useEffect(() => {
    if (timer === null) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(timerRef.current); return null; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timer]);

  function updateLog(exercise, setIdx, field, value) {
    const key = `${exercise}-${setIdx}`;
    setLogs((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function finishWorkout() {
    setSaving(true);
    const durationMins = Math.round((Date.now() - startTime) / 60000);

    const sessionLogs = [];
    let totalVolume   = 0;
    let personalBests = 0;

    day.exercises.forEach((ex) => {
      for (let i = 0; i < ex.sets; i++) {
        const key = `${ex.name}-${i}`;
        const log = logs[key];
        if (log?.reps && log?.weightKg) {
          const reps   = parseInt(log.reps);
          const weight = parseFloat(log.weightKg);
          totalVolume += reps * weight;
          sessionLogs.push({
            exercise:  ex.name,
            setNumber: i + 1,
            reps,
            weightKg:  weight,
            rpe:       log.rpe ? parseInt(log.rpe) : undefined,
          });
        }
      }
    });

    // Save session
    const sessionRes = await fetch("/api/progress", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId:      plan.id,
        dayLabel:    day.dayLabel,
        durationMins,
        logs:        sessionLogs,
      }),
    });
    const { session: savedSession } = await sessionRes.json();

    // Process gamification
    const gamRes = await fetch("/api/gamification", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId:     savedSession.id,
        totalVolumeKg: totalVolume,
        hitAllSets:    sessionLogs.length >= day.exercises.reduce((t, e) => t + e.sets, 0),
        personalBests,
        startedAt:     new Date(startTime).toISOString(),
      }),
    });
    const gamData = await gamRes.json();

    setResult({ ...gamData, totalVolumeKg: totalVolume });
    setSaving(false);
  }

  // Show post-workout screen
  if (result) {
    return <PostWorkoutScreen result={result} onClose={() => setResult(null)} />;
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {allDays.map((d, i) => (
          <button
            key={i}
            onClick={() => setDayIdx(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: i === dayIdx ? "var(--accent)"     : "var(--bg-secondary)",
              color:      i === dayIdx ? "#fff"              : "var(--text-secondary)",
              border:     `1px solid ${i === dayIdx ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {d.dayLabel}
          </button>
        ))}
      </div>

      {/* Rest timer */}
      {timer !== null && (
        <div
          className="rounded-xl p-3 flex items-center justify-between"
          style={{ background: "var(--accent-light)", border: "1px solid var(--accent)" }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--accent-text)" }}>
            ⏱ Rest timer
          </span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
          <button
            onClick={() => setTimer(null)}
            className="text-xs"
            style={{ color: "var(--accent-text)" }}
          >
            Skip
          </button>
        </div>
      )}

      {/* Exercises */}
      {day.exercises.map((exercise) => (
        <div
          key={exercise.name}
          className="rounded-xl p-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {exercise.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {exercise.sets} sets · {exercise.reps} reps · {exercise.restSeconds}s rest
              </p>
              {exercise.notes && (
                <p className="text-xs mt-1 italic" style={{ color: "var(--accent)" }}>
                  {exercise.notes}
                </p>
              )}
            </div>
            <button
              onClick={() => setTimer(exercise.restSeconds)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              ⏱ Timer
            </button>
          </div>

          {/* Set headers */}
          <div
            className="grid gap-2 text-xs mb-2 px-1"
            style={{ gridTemplateColumns: "28px 1fr 1fr 1fr", color: "var(--text-secondary)" }}
          >
            <span>#</span><span className="text-center">Reps</span>
            <span className="text-center">kg</span><span className="text-center">RPE</span>
          </div>

          {/* Set rows */}
          {Array.from({ length: exercise.sets }).map((_, i) => {
            const key = `${exercise.name}-${i}`;
            const log = logs[key] ?? {};
            return (
              <div key={i} className="grid gap-2 mb-2 items-center"
                style={{ gridTemplateColumns: "28px 1fr 1fr 1fr" }}>
                <span className="text-xs text-center font-medium" style={{ color: "var(--text-secondary)" }}>
                  {i + 1}
                </span>
                {["reps", "weightKg", "rpe"].map((field) => (
                  <input
                    key={field}
                    type="number"
                    placeholder={field === "rpe" ? "—" : "0"}
                    min="0"
                    step={field === "weightKg" ? "0.5" : "1"}
                    value={log[field] ?? ""}
                    onChange={(e) => updateLog(exercise.name, i, field, e.target.value)}
                    className="rounded-lg text-center text-sm py-1.5 focus:outline-none w-full"
                    style={{
                      background: "var(--bg-secondary)",
                      border:     `1px solid ${log[field] ? "var(--accent)" : "var(--border)"}`,
                      color:      "var(--text-primary)",
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}

      <button
        onClick={finishWorkout}
        disabled={saving}
        className="w-full py-3 rounded-xl font-bold text-white text-base disabled:opacity-50 transition-all"
        style={{ background: "var(--accent)" }}
      >
        {saving ? "Saving..." : "Finish Workout ✓"}
      </button>
    </div>
  );
}

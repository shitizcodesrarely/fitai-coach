"use client";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { useState } from "react";
import { calculateVolume } from "@/lib/utils";
import dayjs from "dayjs";

export default function ProgressCharts({ sessions, bodyMetrics }) {
  const [activeExercise, setActiveExercise] = useState("Bench Press");

  // ── Volume over time (bar chart) ─────────────────────────────────────────
  const volumeData = sessions.map((s) => ({
    date:   dayjs(s.startedAt).format("MMM D"),
    volume: Math.round(calculateVolume(s.logs)),
  }));

  // ── Max weight per exercise over time (line chart) ────────────────────────
  const allExercises = [...new Set(
    sessions.flatMap((s) => s.logs.map((l) => l.exercise))
  )];

  const exerciseData = sessions.map((s) => {
    const maxForExercise = s.logs
      .filter((l) => l.exercise === activeExercise)
      .reduce((max, l) => Math.max(max, l.weightKg), 0);
    return {
      date:   dayjs(s.startedAt).format("MMM D"),
      weight: maxForExercise || null,
    };
  }).filter((d) => d.weight !== null);

  // ── Body weight over time ─────────────────────────────────────────────────
  const bodyWeightData = bodyMetrics.map((m) => ({
    date:   dayjs(m.loggedAt).format("MMM D"),
    weight: m.weightKg,
  }));

  if (sessions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-500 text-sm">No sessions logged yet. Complete your first workout to see progress charts here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Volume chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Total volume per session</h2>
        <p className="text-xs text-gray-400 mb-5">Total kg lifted (sets × reps × weight)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="volume" fill="#16a34a" radius={[4, 4, 0, 0]} name="Volume (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strength per exercise */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-900">Strength progress</h2>
          <select
            value={activeExercise}
            onChange={(e) => setActiveExercise(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {allExercises.map((ex) => <option key={ex}>{ex}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 mb-5">Max weight lifted per session</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={exerciseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone" dataKey="weight"
              stroke="#16a34a" strokeWidth={2}
              dot={{ r: 4, fill: "#16a34a" }}
              name="Weight (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Body weight */}
      {bodyWeightData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Body weight</h2>
          <p className="text-xs text-gray-400 mb-5">Tracked over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bodyWeightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone" dataKey="weight"
                stroke="#6366f1" strokeWidth={2}
                dot={{ r: 4, fill: "#6366f1" }}
                name="Weight (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

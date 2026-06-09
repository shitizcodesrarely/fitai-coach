"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EQUIPMENT_OPTIONS = [
  "Barbell", "Dumbbells", "Cables", "Machines",
  "Pull-up bar", "Resistance bands", "Bodyweight only",
];

export default function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [equipment, setEquipment] = useState([]);

  function toggleEquipment(item) {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.target);

    const res = await fetch("/api/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age:         parseInt(fd.get("age")),
        weightKg:    parseFloat(fd.get("weightKg")),
        heightCm:    parseFloat(fd.get("heightCm")),
        goal:        fd.get("goal"),
        experience:  fd.get("experience"),
        daysPerWeek: parseInt(fd.get("daysPerWeek")),
        equipment:   equipment.join(", "),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to generate plan");
      setLoading(false);
    } else {
      // Plan is being generated in background — poll for it
      router.push("/workout?generating=true");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      {/* Basic stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: "age",      label: "Age",        type: "number", placeholder: "22" },
          { name: "weightKg", label: "Weight (kg)", type: "number", placeholder: "75" },
          { name: "heightCm", label: "Height (cm)", type: "number", placeholder: "175" },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
              name={name} type={type} placeholder={placeholder} required step="0.1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      {/* Goal */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Goal</label>
        <div className="grid grid-cols-3 gap-2">
          {["BULK", "CUT", "MAINTAIN", "STRENGTH", "ENDURANCE"].map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="goal" value={g} required className="accent-green-600" />
              <span className="text-sm text-gray-700 capitalize">{g.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Experience level</label>
        <div className="grid grid-cols-3 gap-2">
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="experience" value={level} required className="accent-green-600" />
              <span className="text-sm text-gray-700 capitalize">{level.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Days per week */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Days per week</label>
        <select
          name="daysPerWeek" required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {[2, 3, 4, 5, 6].map((d) => (
            <option key={d} value={d}>{d} days</option>
          ))}
        </select>
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Available equipment</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <button
              type="button" key={item}
              onClick={() => toggleEquipment(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                equipment.includes(item)
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Sending to Claude AI..." : "Generate my plan ✨"}
      </button>
    </form>
  );
}

"use client";
import dayjs from "dayjs";

// Shows 52 weeks of workout activity like LeetCode's contribution graph
export default function StreakHeatmap({ sessions = [] }) {
  // Build a map of date -> volume
  const volumeMap = {};
  sessions.forEach((s) => {
    const date = dayjs(s.startedAt).format("YYYY-MM-DD");
    volumeMap[date] = (volumeMap[date] ?? 0) + (s.totalVolumeKg ?? 0);
  });

  // Generate last 52 weeks of dates
  const today    = dayjs();
  const start    = today.subtract(51, "week").startOf("week");
  const weeks    = [];

  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date   = start.add(w * 7 + d, "day");
      const key    = date.format("YYYY-MM-DD");
      const volume = volumeMap[key] ?? 0;
      week.push({ date: key, volume, label: date.format("MMM D") });
    }
    weeks.push(week);
  }

  function getColor(volume) {
    if (volume === 0)         return "var(--bg-secondary, #f3f4f6)";
    if (volume < 500)         return "#bbf7d0";
    if (volume < 1500)        return "#4ade80";
    if (volume < 3000)        return "#16a34a";
    return "#14532d";
  }

  const months = [];
  let lastMonth = "";
  weeks.forEach((week, i) => {
    const month = dayjs(week[0].date).format("MMM");
    if (month !== lastMonth) { months.push({ label: month, col: i }); lastMonth = month; }
  });

  return (
    <div>
      <div className="flex gap-1 mb-1 text-xs" style={{ color: "var(--text-secondary)" }}>
        {months.map((m) => (
          <div key={m.col} style={{ gridColumn: m.col + 1, marginLeft: m.col === 0 ? 0 : undefined }}>
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.label}: ${day.volume > 0 ? day.volume.toFixed(0) + "kg" : "Rest day"}`}
                className="rounded-sm cursor-default"
                style={{
                  width:      10,
                  height:     10,
                  background: getColor(day.volume),
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Less</span>
        {[0, 300, 1000, 2000, 4000].map((v) => (
          <div
            key={v}
            className="rounded-sm"
            style={{ width: 10, height: 10, background: getColor(v) }}
          />
        ))}
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>More</span>
      </div>
    </div>
  );
}

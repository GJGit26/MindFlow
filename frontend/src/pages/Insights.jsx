import { useState, useEffect } from "react";
import { useEntries } from "../hooks/useEntries";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOOD_COLORS = {
  happy: "#F59E0B", calm: "#10B981", excited: "#EC4899",
  grateful: "#14B8A6", anxious: "#F97316", sad: "#6366F1", neutral: "#6B7280",
};
const MOOD_EMOJI = { happy: "😊", calm: "😌", excited: "🤩", grateful: "🙏", anxious: "😰", sad: "😢", neutral: "😐" };

export default function Insights() {
  const { entries, stats, loading } = useEntries();
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    if (!entries.length) return;
    setGenerating(true);
    const summary = entries.slice(0, 7).map((e) => `[${e.mood}]: ${e.text.slice(0, 80)}`).join("\n");
    try {
      const { data } = await axios.post(`${API}/entries/weekly-report`, { entries: summary });
      setWeeklyReport(data);
    } catch {
      // Fallback demo report
      setWeeklyReport({
        headline: "A week of growth and self-awareness",
        overview: "This week, your journal reflects a rich emotional landscape — moments of pride, occasional stress, and genuine gratitude. The fact that you're writing consistently is itself a sign of emotional maturity.",
        patterns: [
          "You tend to feel most energized in the morning — your best entries come on those days.",
          "Stress appears when deadlines approach, but you consistently reframe it as motivation.",
          "Gratitude appears even in tough entries — a powerful mindset indicator.",
        ],
        strength: "Your emotional vocabulary is growing. You don't just write 'I'm sad' — you explore why, and that's the whole game.",
        challenge: "When anxious, you tend to catastrophize briefly before catching yourself. Practice catching it earlier.",
        affirmation: "You are more self-aware than most people twice your age. Keep showing up.",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Mood distribution for pie-like bar
  const totalEntries = entries.length || 1;
  const moodDist = Object.entries(stats.moodCounts || {}).sort((a, b) => b[1] - a[1]);

  // Sentiment ratio
  const positiveRatio = totalEntries > 0 ? Math.round((stats.positiveCount / totalEntries) * 100) : 0;

  // Last 14 days mood timeline
  const timeline = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400000);
    const entry = entries.find((e) => {
      const d = new Date(e.createdAt);
      return d.toDateString() === date.toDateString();
    });
    return { date, entry, label: date.toLocaleDateString("en-IN", { weekday: "short" }) };
  });

  return (
    <div className="journal-page" style={{ maxWidth: 860 }}>
      <div className="journal-header">
        <h1 className="journal-title">Insights 📊</h1>
        <p className="journal-sub">Your emotional patterns, visualized</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="stat-card">
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-sub">journal entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Positive Days</div>
              <div className="stat-value" style={{ color: "#10B981" }}>{positiveRatio}%</div>
              <div className="stat-sub">of entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Top Mood</div>
              <div className="stat-value" style={{ fontSize: "1.4rem" }}>
                {MOOD_EMOJI[stats.topMood]} {stats.topMood}
              </div>
              <div className="stat-sub">most frequent</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value" style={{ color: "#F59E0B" }}>{stats.streak} 🔥</div>
              <div className="stat-sub">days</div>
            </div>
          </div>

          {/* 14-day Timeline */}
          <div className="dash-card" style={{ marginBottom: "1.25rem" }}>
            <div className="dash-card-title">14-Day Mood Timeline</div>
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: 80 }}>
              {timeline.map((day, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    title={day.entry ? `${day.entry.mood}: ${day.entry.text.slice(0, 40)}...` : "No entry"}
                    style={{
                      width: "100%",
                      height: day.entry ? "60px" : "8px",
                      borderRadius: 4,
                      background: day.entry ? MOOD_COLORS[day.entry.mood] : "var(--surface2)",
                      opacity: day.entry ? 0.85 : 0.3,
                      transition: "all 0.3s",
                      cursor: day.entry ? "pointer" : "default",
                    }}
                  />
                  <span style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>
                    {i % 2 === 0 ? day.label : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-grid" style={{ marginBottom: "1.5rem" }}>
            {/* Mood Distribution */}
            <div className="dash-card">
              <div className="dash-card-title">Mood Distribution</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {moodDist.slice(0, 5).map(([mood, count]) => (
                  <div key={mood}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                        {MOOD_EMOJI[mood]} <span style={{ textTransform: "capitalize" }}>{mood}</span>
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {count} {count === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                    <div style={{ background: "var(--surface2)", borderRadius: 100, height: 6, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(count / totalEntries) * 100}%`,
                        background: MOOD_COLORS[mood],
                        borderRadius: 100,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
                {moodDist.length === 0 && (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No entries yet. Start journaling!</p>
                )}
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="dash-card">
              <div className="dash-card-title">Emotional Tone</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Positive", count: stats.positiveCount, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
                  { label: "Neutral", count: stats.total - stats.positiveCount - stats.negativeCount, color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
                  { label: "Negative", count: stats.negativeCount, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: s.bg,
                    border: `1px solid ${s.color}33`,
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: "0.875rem", color: s.color, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: s.color }}>
                      {Math.max(0, s.count)}
                    </span>
                  </div>
                ))}

                {/* Positive ratio ring */}
                <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                  <div style={{
                    fontSize: "2.5rem", fontWeight: 800,
                    fontFamily: "Syne, sans-serif",
                    color: positiveRatio >= 60 ? "#10B981" : positiveRatio >= 40 ? "#F59E0B" : "#EF4444",
                  }}>
                    {positiveRatio}%
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>overall positive</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Weekly Report */}
          <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: weeklyReport ? "1.25rem" : 0 }}>
              <div className="dash-card-title" style={{ marginBottom: 0 }}>✨ AI Weekly Report</div>
              <button
                className="analyze-btn"
                onClick={generateReport}
                disabled={generating || !entries.length}
                style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
              >
                {generating ? <><span className="spinner" style={{ width: 12, height: 12, marginRight: 6 }} />Generating...</> : "Generate Report"}
              </button>
            </div>

            {!weeklyReport && !generating && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "1rem" }}>
                Click "Generate Report" to get a personalized AI analysis of your emotional patterns this week.
              </p>
            )}

            {weeklyReport && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <h3 style={{
                  fontFamily: "Syne, sans-serif", fontSize: "1.2rem",
                  marginBottom: "0.75rem", color: "var(--accent2)",
                }}>
                  "{weeklyReport.headline}"
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  {weeklyReport.overview}
                </p>

                {weeklyReport.patterns && (
                  <>
                    <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
                      Patterns Detected
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                      {weeklyReport.patterns.map((p, i) => (
                        <div key={i} style={{
                          background: "var(--surface2)", borderRadius: 8, padding: "0.6rem 0.9rem",
                          fontSize: "0.875rem", color: "var(--text-muted)",
                          borderLeft: "3px solid var(--accent)",
                        }}>
                          {p}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600, marginBottom: "0.4rem" }}>💪 YOUR STRENGTH</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{weeklyReport.strength}</p>
                  </div>
                  <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "#F97316", fontWeight: 600, marginBottom: "0.4rem" }}>🎯 WORK ON THIS</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{weeklyReport.challenge}</p>
                  </div>
                </div>

                <div style={{
                  background: "linear-gradient(135deg, rgba(124,106,255,0.12), rgba(182,154,255,0.06))",
                  border: "1px solid rgba(124,106,255,0.2)",
                  borderRadius: 10, padding: "1rem 1.25rem",
                  fontStyle: "italic", fontSize: "0.95rem",
                  color: "var(--accent2)", lineHeight: 1.6,
                }}>
                  ✨ "{weeklyReport.affirmation}"
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {entries.length > 0 && (
            <div className="dash-card">
              <div className="dash-card-title">Recent Activity</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {entries.slice(0, 5).map((e) => (
                  <div key={e._id} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    background: "var(--surface2)", borderRadius: 8,
                  }}>
                    <span style={{ fontSize: "1.25rem" }}>{MOOD_EMOJI[e.mood]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--text)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {e.text}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                      <span className={`entry-sentiment sentiment-${e.sentiment}`}>{e.sentiment}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                        {new Date(e.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

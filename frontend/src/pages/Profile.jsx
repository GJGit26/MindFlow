import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEntries } from "../hooks/useEntries";

const MOOD_EMOJI = { happy: "😊", calm: "😌", excited: "🤩", grateful: "🙏", anxious: "😰", sad: "😢", neutral: "😐" };
const QUOTES = [
  "The journal is a vehicle for my sense of selfhood. — Susan Sontag",
  "Writing in a journal reminds you of your goals and of your learning in life. Robin Sharma",
  "Fill your paper with the breathings of your heart. - William Wordsworth",
  "In the journal I am at ease. — Anaïs Nin",
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { stats, entries } = useEntries();
  const [showLogout, setShowLogout] = useState(false);
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const joinedDate = new Date();
  joinedDate.setDate(joinedDate.getDate() - stats.total * 1.2);

  return (
    <div className="journal-page" style={{ maxWidth: 640 }}>
      <div className="journal-header">
        <h1 className="journal-title">Profile</h1>
        <p className="journal-sub">Your journey at a glance</p>
      </div>

      {/* User Card */}
      <div className="dash-card" style={{ marginBottom: "1.25rem", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C6AFF, #EC4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", fontWeight: 700, color: "#fff",
          margin: "0 auto 1rem",
          fontFamily: "Syne, sans-serif",
        }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          {user?.name}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          {user?.email}
        </p>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
          <blockquote style={{
            fontStyle: "italic", fontSize: "0.9rem",
            color: "var(--text-muted)", lineHeight: 1.6,
          }}>
            {quote}
          </blockquote>
        </div>
      </div>

      {/* Journey Stats */}
      <div className="stats-grid" style={{ marginBottom: "1.25rem" }}>
        <div className="stat-card">
          <div className="stat-label">Entries Written</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Day Streak</div>
          <div className="stat-value" style={{ color: "#F59E0B" }}>{stats.streak} 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Positive Days</div>
          <div className="stat-value" style={{ color: "#10B981" }}>
            {stats.total > 0 ? Math.round((stats.positiveCount / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top Mood</div>
          <div className="stat-value" style={{ fontSize: "1.3rem" }}>
            {MOOD_EMOJI[stats.topMood]} {stats.topMood}
          </div>
        </div>
      </div>

      {/* Mood Badges */}
      {Object.keys(stats.moodCounts || {}).length > 0 && (
        <div className="dash-card" style={{ marginBottom: "1.25rem" }}>
          <div className="dash-card-title">Moods Experienced</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {Object.entries(stats.moodCounts).map(([mood, count]) => (
              <div key={mood} style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 100,
                padding: "0.4rem 0.9rem",
                fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {MOOD_EMOJI[mood]} {mood}
                <span style={{
                  background: "rgba(124,106,255,0.2)",
                  color: "var(--accent2)",
                  fontSize: "0.7rem", padding: "1px 6px",
                  borderRadius: 100, fontWeight: 600,
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="dash-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dash-card-title">Achievements</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { icon: "✍️", label: "First Entry", desc: "You started your journey", earned: stats.total >= 1 },
            { icon: "🔥", label: "3-Day Streak", desc: "Three days in a row", earned: stats.streak >= 3 },
            { icon: "💎", label: "7-Day Streak", desc: "A full week of journaling", earned: stats.streak >= 7 },
            { icon: "🧠", label: "AI Explorer", desc: "Used AI analysis feature", earned: stats.total >= 1 },
            { icon: "📚", label: "Prolific Writer", desc: "10+ journal entries", earned: stats.total >= 10 },
            { icon: "🌈", label: "Emotional Range", desc: "Logged 4+ different moods", earned: Object.keys(stats.moodCounts || {}).length >= 4 },
          ].map((a) => (
            <div key={a.label} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.6rem 0.75rem",
              background: a.earned ? "rgba(124,106,255,0.08)" : "var(--surface2)",
              borderRadius: 8,
              border: `1px solid ${a.earned ? "rgba(124,106,255,0.2)" : "transparent"}`,
              opacity: a.earned ? 1 : 0.4,
            }}>
              <span style={{ fontSize: "1.25rem", filter: a.earned ? "none" : "grayscale(1)" }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{a.label}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.desc}</div>
              </div>
              {a.earned && (
                <span style={{
                  marginLeft: "auto", fontSize: "0.7rem",
                  background: "rgba(16,185,129,0.15)",
                  color: "#10B981", padding: "2px 8px",
                  borderRadius: 100, fontWeight: 600,
                }}>
                  Earned ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="dash-card">
        <div className="dash-card-title">Account</div>
        {!showLogout ? (
          <button
            onClick={() => setShowLogout(true)}
            className="logout-btn"
            style={{ fontSize: "0.9rem", padding: "0.6rem 1.2rem" }}
          >
            Sign Out
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Are you sure?</p>
            <button
              onClick={logout}
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#EF4444", padding: "0.5rem 1rem", borderRadius: 8,
                fontSize: "0.85rem", cursor: "pointer",
              }}
            >
              Yes, sign out
            </button>
            <button
              onClick={() => setShowLogout(false)}
              className="logout-btn"
              style={{ fontSize: "0.85rem" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

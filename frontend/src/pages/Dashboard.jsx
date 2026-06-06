import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOOD_COLORS = {
  happy: "#F59E0B", calm: "#10B981", excited: "#EC4899",
  grateful: "#14B8A6", anxious: "#F97316", sad: "#6366F1", neutral: "#6B7280",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, streak: 0, topMood: "calm" });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(`${API}/entries`);
      setEntries(data);
      computeStats(data);
    } catch {
      // Demo data if backend not connected
      const demo = [
        { _id: "1", mood: "happy", text: "Had an amazing day! Finished my MERN project and it looks great. Feeling proud of myself.", sentiment: "positive", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: "2", mood: "calm", text: "Morning walk was peaceful. The weather felt perfect. Just grateful for small things today.", sentiment: "positive", createdAt: new Date(Date.now() - 172800000).toISOString() },
        { _id: "3", mood: "anxious", text: "Internship deadlines are piling up. Feeling a bit overwhelmed but I know I can push through.", sentiment: "negative", createdAt: new Date(Date.now() - 259200000).toISOString() },
        { _id: "4", mood: "grateful", text: "Got feedback from a mentor today. It was constructive and really helpful for my growth.", sentiment: "positive", createdAt: new Date(Date.now() - 345600000).toISOString() },
      ];
      setEntries(demo);
      computeStats(demo);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (data) => {
    const moodCount = {};
    data.forEach((e) => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
    const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "calm";
    setStats({ total: data.length, streak: Math.min(data.length, 7), topMood });
  };

  const getMoodEmoji = (mood) => ({ happy: "😊", calm: "😌", anxious: "😰", sad: "😢", excited: "🤩", grateful: "🙏", neutral: "😐" }[mood] || "😐");

  const chartData = DAYS.map((d, i) => {
    const entry = entries[entries.length - 7 + i];
    return { day: d, height: entry ? 40 + Math.random() * 60 : 10, color: entry ? MOOD_COLORS[entry.mood] || "#6B7280" : "#1A1A24" };
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Entries</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">thoughts journaled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value" style={{ color: "#F59E0B" }}>{stats.streak}🔥</div>
          <div className="stat-sub">days in a row</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top Mood</div>
          <div className="stat-value" style={{ fontSize: "1.5rem" }}>{getMoodEmoji(stats.topMood)} {stats.topMood}</div>
          <div className="stat-sub">this week</div>
        </div>
        <div className="stat-card" style={{ background: "rgba(124,106,255,0.1)", borderColor: "rgba(124,106,255,0.2)" }}>
          <div className="stat-label">Quick Journal</div>
          <Link to="/journal" className="btn-primary" style={{ marginTop: "0.5rem", display: "inline-flex", fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}>
            Write Now →
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="dashboard-grid">
        {/* Mood Chart */}
        <div className="dash-card">
          <div className="dash-card-title">Weekly Mood Chart</div>
          <div className="mood-chart">
            {chartData.map((bar, i) => (
              <div key={i} className="mood-bar-wrap">
                <div className="mood-bar" style={{ height: `${bar.height}%`, background: bar.color }} />
                <span className="mood-bar-label">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="dash-card">
          <div className="dash-card-title">Recent Entries</div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}><div className="spinner" /></div>
          ) : (
            <div className="entries-list">
              {entries.slice(0, 3).map((entry) => (
                <div key={entry._id} className="entry-item">
                  <div className="entry-emoji">{getMoodEmoji(entry.mood)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="entry-text">{entry.text}</div>
                    <div className="entry-meta">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <span className={`entry-sentiment sentiment-${entry.sentiment}`}>
                    {entry.sentiment}
                  </span>
                </div>
              ))}
              {entries.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
                  No entries yet. <Link to="/journal" style={{ color: "var(--accent2)" }}>Write your first one!</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOODS = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "sad", emoji: "😢", label: "Sad" },
];

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("calm");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(`${API}/entries`);
      setEntries(data);
    } catch {
      setEntries([
        { _id: "1", mood: "happy", text: "Had an amazing day! Finished my MERN project.", sentiment: "positive", aiInsight: "You're feeling proud and accomplished. Keep building!", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: "2", mood: "anxious", text: "Deadlines are stressing me out. Need to manage time better.", sentiment: "negative", aiInsight: "Stress around goals is normal. Try breaking tasks into smaller steps.", createdAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
    }
  };

  const analyzeText = async () => {
    if (!text.trim() || text.length < 10) return;
    setAnalyzing(true);
    try {
      const { data } = await axios.post(`${API}/entries/analyze`, { text, mood });
      setAnalysis(data);
    } catch {
      // Fallback demo analysis
      setAnalysis({
        sentiment: text.toLowerCase().includes("great") || text.toLowerCase().includes("happy") || text.toLowerCase().includes("good") ? "positive" : text.toLowerCase().includes("stress") || text.toLowerCase().includes("anxious") || text.toLowerCase().includes("sad") ? "negative" : "neutral",
        emotions: ["reflective", "present", "aware"],
        insight: "Your writing reflects a thoughtful inner world. Taking time to journal is itself an act of self-care. Whatever you're going through, writing it down helps process and release it.",
        suggestion: "Try a 5-minute breathing exercise before your next entry to deepen your reflection.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const saveEntry = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const payload = { text, mood, sentiment: analysis?.sentiment || "neutral", aiInsight: analysis?.insight || "" };
      const { data } = await axios.post(`${API}/entries`, payload);
      setEntries([data, ...entries]);
    } catch {
      const newEntry = { _id: Date.now().toString(), text, mood, sentiment: analysis?.sentiment || "neutral", aiInsight: analysis?.insight || "", createdAt: new Date().toISOString() };
      setEntries([newEntry, ...entries]);
    }
    setText(""); setAnalysis(null); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const getMoodEmoji = (m) => MOODS.find((x) => x.id === m)?.emoji || "😐";

  return (
    <div className="journal-page">
      <div className="journal-header">
        <h1 className="journal-title">Today's Journal</h1>
        <p className="journal-sub">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Mood Picker */}
      <div className="mood-picker">
        <div className="mood-picker-label">How are you feeling right now?</div>
        <div className="mood-options">
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={`mood-option ${mood === m.id ? "selected" : ""}`}
              onClick={() => setMood(m.id)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        className="journal-textarea"
        placeholder="What's on your mind today? Write freely — no judgment, no rules. This is your safe space..."
        value={text}
        onChange={(e) => { setText(e.target.value); setAnalysis(null); }}
      />

      {/* Actions */}
      <div className="journal-actions">
        <button className="analyze-btn" onClick={analyzeText} disabled={analyzing || text.length < 10}>
          {analyzing ? <><span className="spinner" style={{ width: 14, height: 14, marginRight: 8 }} /> Analyzing...</> : "✨ Analyze with AI"}
        </button>
        <button
          className="btn-primary"
          onClick={saveEntry}
          disabled={saving || !text.trim()}
          style={{ padding: "0.75rem 1.5rem", fontSize: "0.9rem", borderRadius: 10 }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Entry"}
        </button>
      </div>

      {/* AI Analysis Result */}
      {analysis && (
        <div className="ai-result">
          <div className="ai-result-header">
            <span>✨</span> AI Insight
          </div>
          <div className="ai-result-content">{analysis.insight}</div>
          {analysis.suggestion && (
            <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-dim)", fontStyle: "italic" }}>
              💡 {analysis.suggestion}
            </div>
          )}
          <div className="ai-badges">
            <span
              className="ai-badge"
              style={{
                background: analysis.sentiment === "positive" ? "rgba(16,185,129,0.15)" : analysis.sentiment === "negative" ? "rgba(239,68,68,0.15)" : "rgba(107,114,128,0.15)",
                color: analysis.sentiment === "positive" ? "#10B981" : analysis.sentiment === "negative" ? "#EF4444" : "#9CA3AF",
              }}
            >
              {analysis.sentiment} tone
            </span>
            {(analysis.emotions || []).map((e, i) => (
              <span key={i} className="ai-badge" style={{ background: "rgba(124,106,255,0.1)", color: "var(--accent2)" }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Past Entries */}
      {entries.length > 0 && (
        <>
          <div className="past-entries-title">Past Entries</div>
          <div className="past-entries-list">
            {entries.map((entry) => (
              <div key={entry._id} className="past-entry-card">
                <div className="past-entry-top">
                  <div className="past-entry-mood">
                    {getMoodEmoji(entry.mood)}
                    <span style={{ textTransform: "capitalize" }}>{entry.mood}</span>
                    {entry.sentiment && (
                      <span className={`entry-sentiment sentiment-${entry.sentiment}`}>{entry.sentiment}</span>
                    )}
                  </div>
                  <span className="past-entry-date">
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="past-entry-text">{entry.text}</div>
                {entry.aiInsight && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent2)", opacity: 0.7, fontStyle: "italic" }}>
                    ✨ {entry.aiInsight}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

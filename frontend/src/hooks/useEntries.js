import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DEMO_ENTRIES = [
  { _id: "d1", mood: "happy", text: "Had an amazing day! Finished my MERN project and it looks great. Feeling proud of myself.", sentiment: "positive", emotions: ["proud", "accomplished", "motivated"], aiInsight: "Your sense of achievement is radiating through your words. Celebrate this win!", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "d2", mood: "calm", text: "Morning walk was peaceful. The weather felt perfect. Just grateful for small things today.", sentiment: "positive", emotions: ["peaceful", "grateful", "present"], aiInsight: "Mindfulness in small moments is a powerful habit. You're cultivating inner peace.", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "d3", mood: "anxious", text: "Internship deadlines are piling up. Feeling a bit overwhelmed but I know I can push through.", sentiment: "negative", emotions: ["anxious", "determined", "stressed"], aiInsight: "It's okay to feel overwhelmed. Your self-awareness and determination will carry you through.", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { _id: "d4", mood: "grateful", text: "Got feedback from a mentor today. Constructive and really helpful for my growth.", sentiment: "positive", emotions: ["grateful", "hopeful", "growing"], aiInsight: "Embracing feedback is a sign of emotional maturity. You're on a great path.", createdAt: new Date(Date.now() - 345600000).toISOString() },
  { _id: "d5", mood: "excited", text: "Started learning about system design today. The concepts are blowing my mind!", sentiment: "positive", emotions: ["curious", "excited", "engaged"], aiInsight: "This intellectual excitement is fuel for growth. Ride this wave!", createdAt: new Date(Date.now() - 432000000).toISOString() },
  { _id: "d6", mood: "sad", text: "Missed a deadline today. Feeling down about it. Need to regroup and plan better.", sentiment: "negative", emotions: ["disappointed", "reflective", "motivated"], aiInsight: "Setbacks are part of the journey. Your reflection shows resilience in the making.", createdAt: new Date(Date.now() - 518400000).toISOString() },
  { _id: "d7", mood: "calm", text: "Spent Sunday reading and just being. No productivity guilt today. It felt right.", sentiment: "positive", emotions: ["content", "rested", "balanced"], aiInsight: "Rest is not a reward — it's a necessity. You're learning to honor your needs.", createdAt: new Date(Date.now() - 604800000).toISOString() },
];

export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API}/entries`);
      setEntries(data);
      setIsDemo(false);
    } catch {
      setEntries(DEMO_ENTRIES);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (payload) => {
    try {
      const { data } = await axios.post(`${API}/entries`, payload);
      setEntries((prev) => [data, ...prev]);
      return data;
    } catch {
      const local = { _id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() };
      setEntries((prev) => [local, ...prev]);
      return local;
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API}/entries/${id}`);
    } catch {}
    setEntries((prev) => prev.filter((e) => e._id !== id));
  };

  const analyzeText = async (text, mood) => {
    try {
      const { data } = await axios.post(`${API}/entries/analyze`, { text, mood });
      return data;
    } catch {
      const positive = ["great", "happy", "love", "amazing", "good", "proud", "grateful", "excited"];
      const negative = ["stress", "anxious", "sad", "overwhelm", "worry", "bad", "miss", "fail"];
      const lc = text.toLowerCase();
      const posScore = positive.filter((w) => lc.includes(w)).length;
      const negScore = negative.filter((w) => lc.includes(w)).length;
      const sentiment = posScore > negScore ? "positive" : negScore > posScore ? "negative" : "neutral";
      return {
        sentiment,
        emotions: ["reflective", "aware", "present"],
        insight: "Your words carry depth and honesty. Writing itself is healing — the act of putting thoughts to words creates clarity and release. Keep showing up for yourself.",
        suggestion: "Try ending each entry with one thing you're grateful for, no matter how small.",
      };
    }
  };

  // Derived stats
  const stats = {
    total: entries.length,
    streak: Math.min(entries.length, 7),
    positiveCount: entries.filter((e) => e.sentiment === "positive").length,
    negativeCount: entries.filter((e) => e.sentiment === "negative").length,
    topMood: (() => {
      const counts = {};
      entries.forEach((e) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "calm";
    })(),
    moodCounts: entries.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {}),
    weeklyEntries: entries.slice(0, 7),
  };

  return { entries, loading, error, isDemo, stats, addEntry, deleteEntry, analyzeText, refetch: fetchEntries };
};

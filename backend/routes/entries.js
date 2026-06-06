import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import Entry from "../models/Entry.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /api/entries — get all entries for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching entries" });
  }
});

// POST /api/entries/analyze — AI sentiment analysis (doesn't save)
router.post("/analyze", protect, async (req, res) => {
  try {
    const { text, mood } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `You are a compassionate mental wellness AI for a journaling app. Analyze this journal entry and respond ONLY with a valid JSON object (no markdown, no explanation):

Journal entry (mood: ${mood}): "${text}"

JSON format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "insight": "A warm, 2-3 sentence empathetic insight about what they wrote",
  "suggestion": "One gentle, practical suggestion for their wellbeing"
}`,
        },
      ],
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(raw);
    res.json(analysis);
  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
});

// POST /api/entries — save a new journal entry
router.post("/", protect, async (req, res) => {
  try {
    const { text, mood, sentiment, aiInsight, emotions } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const entry = await Entry.create({
      user: req.user._id,
      text,
      mood: mood || "neutral",
      sentiment: sentiment || "neutral",
      aiInsight: aiInsight || "",
      emotions: emotions || [],
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Error saving entry" });
  }
});

// POST /api/entries/weekly-report — AI-generated weekly summary
router.post("/weekly-report", protect, async (req, res) => {
  try {
    const { entries } = req.body;
    if (!entries) return res.status(400).json({ message: "Entries summary required" });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: `You are a compassionate mental wellness coach reviewing someone's weekly journal. Based on these entries, write a personalized weekly report. Respond ONLY with a valid JSON object:

Entries this week:
${entries}

JSON format:
{
  "headline": "A short poetic headline summarizing the week (max 8 words)",
  "overview": "2-3 warm, empathetic sentences about the week overall",
  "patterns": ["Pattern 1 observed", "Pattern 2 observed", "Pattern 3 observed"],
  "strength": "One specific emotional strength they demonstrated this week",
  "challenge": "One gentle, constructive area to work on",
  "affirmation": "A personalized affirmation for them (1 sentence, warm and specific)"
}`,
        },
      ],
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const report = JSON.parse(raw);
    res.json(report);
  } catch (err) {
    console.error("Weekly report error:", err);
    res.status(500).json({ message: "Report generation failed" });
  }
});

// DELETE /api/entries/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    await entry.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting entry" });
  }
});

export default router;

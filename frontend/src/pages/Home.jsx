import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const moods = ["happy", "calm", "anxious", "sad", "excited", "grateful"];
const moodColors = {
  happy: "#F59E0B",
  calm: "#10B981",
  anxious: "#F97316",
  sad: "#6366F1",
  excited: "#EC4899",
  grateful: "#14B8A6",
};
const moodEmojis = {
  happy: "😊",
  calm: "😌",
  anxious: "😰",
  sad: "😢",
  excited: "🤩",
  grateful: "🙏",
};

export default function Home() {
  const [currentMood, setCurrentMood] = useState("calm");
  const [isLoaded, setIsLoaded] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const moodIdx = useRef(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      moodIdx.current = (moodIdx.current + 1) % moods.length;
      setCurrentMood(moods[moodIdx.current]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* NAV */}
      <nav className="home-nav">
        <div className="nav-logo">
          <span
            className="logo-dot"
            style={{ background: moodColors[currentMood] }}
          />
          MindFlow
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Sign In
          </Link>
          <Link to="/register" className="nav-cta">
            Start Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        {/* Spline 3D Animation */}

  

        <div className="spline-container">
          {!splineReady && (
            <div className="spline-fallback">
              <div className="blob-animation">
                <div
                  className="blob blob-1"
                  style={{ background: moodColors[currentMood] }}
                />
                <div
                  className="blob blob-2"
                  style={{ background: moodColors[currentMood] + "99" }}
                />
                <div
                  className="blob blob-3"
                  style={{ background: moodColors[currentMood] + "55" }}
                />
              </div>
            </div>
          )}



          <div
            className={`spline-wrapper ${splineReady ? "visible" : "hidden"}`}
          >
            <Spline src="" onLoad={() => setSplineReady(true)} />
          </div>
        </div>

        
        {/* Hero Text */}
        <div className={`hero-content ${isLoaded ? "hero-loaded" : ""}`}>
          <div className="mood-tag">
            <span>{moodEmojis[currentMood]}</span>
            <span style={{ color: moodColors[currentMood] }}>
              Feeling {currentMood}?
            </span>
          </div>
          <h1 className="hero-title">
            Your mind deserves
            <br />
            <span
              className="gradient-text"
              style={{ "--mood-color": moodColors[currentMood] }}
            >
              a safe space.
            </span>
          </h1>
          <p className="hero-sub">
            MindFlow uses AI to understand your emotions, track your mood
            patterns, and help you build a healthier relationship with yourself
            — one entry at a time.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Begin Your Journey →
            </Link>
            <Link to="/login" className="btn-ghost">
              I already journal
            </Link>
          </div>

          <div className="social-proof">
            <div className="avatars">
              {["S", "A", "R", "M"].map((l, i) => (
                <div key={i} className="avatar" style={{ zIndex: 4 - i }}>
                  {l}
                </div>
              ))}
            </div>
          
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2 className="section-title">Everything your journal needs</h2>
        <div className="features-grid">
          {[
            {
              icon: "🧠",
              title: "AI Sentiment Analysis",
              desc: "Claude AI reads between the lines to understand your emotional state, even when you can't.",
            },
            {
              icon: "📊",
              title: "Mood Patterns",
              desc: "Beautiful charts showing your emotional journey over days, weeks, and months.",
            },
            {
              icon: "🔒",
              title: "Private & Secure",
              desc: "End-to-end encrypted. Your thoughts are yours alone. Always.",
            },
            {
              icon: "⚡",
              title: "Quick Capture",
              desc: "Log your mood in seconds with voice-to-text or emoji shortcuts.",
            },
            {
              icon: "🌙",
              title: "Daily Reminders",
              desc: "Gentle nudges at the right time to keep your journaling habit alive.",
            },
            {
              icon: "💫",
              title: "Insights & Growth",
              desc: "Weekly AI-generated reports on your emotional patterns and triggers.",
            },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <h2 className="section-title">How MindFlow works</h2>
        <div className="steps">
          {[
            {
              step: "01",
              title: "Write freely",
              desc: "Just type how you're feeling. No rules, no judgment.",
            },
            {
              step: "02",
              title: "AI understands",
              desc: "Our AI analyzes tone, emotion, and context in real-time.",
            },
            {
              step: "03",
              title: "See patterns",
              desc: "Track your mood over time with beautiful visual analytics.",
            },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.step}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Start your mental wellness journey</h2>
          <p>Free forever. No credit card. Just you and your thoughts.</p>
          <Link to="/register" className="btn-primary btn-large">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-dot" />
          MindFlow
        </div>
        <p className="footer-copy">
          Built with ❤️ by a developer who believes mental health matters.
        </p>
      </footer>
    </div>
  );
}

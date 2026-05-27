// ============================================================
//  UrbanPolicy AI — App.jsx
//  Main React component. All API calls go through /api/generate
//  (the serverless proxy) so the API key stays server-side.
// ============================================================

import { useState, useRef, useEffect } from "react";

// ── Static Configuration Data ────────────────────────────────

const POLICY_SECTORS = [
  { id: "climate",  label: "Climate Action",          icon: "🌱", color: "#2d6a4f" },
  { id: "traffic",  label: "Traffic & Mobility",      icon: "🚦", color: "#1d3557" },
  { id: "housing",  label: "Affordable Housing",      icon: "🏚️", color: "#6d4c41" },
  { id: "energy",   label: "Energy & Sustainability", icon: "⚡", color: "#f4a261" },
  { id: "health",   label: "Public Health",           icon: "🏥", color: "#457b9d" },
  { id: "waste",    label: "Waste Management",        icon: "♻️", color: "#40916c" },
  { id: "safety",   label: "Public Safety",           icon: "🚨", color: "#c1121f" },
  { id: "digital",  label: "Digital Inclusion",       icon: "💻", color: "#7209b7" },
];

const POLICY_TYPES = [
  "Action Plan",
  "Ordinance Draft",
  "Strategic Framework",
  "Regulatory Guideline",
  "Budget Proposal",
  "Emergency Protocol",
];

const CITY_SIZES = [
  "Small City (< 100K)",
  "Mid-size City (100K–500K)",
  "Large City (500K–2M)",
  "Metro Area (2M+)",
];

const TONES = [
  "Formal & Legislative",
  "Technical & Data-driven",
  "Public-facing & Accessible",
  "Executive Briefing",
];

// ── TypewriterText Component ──────────────────────────────────
// Animates the AI response character by character.

function TypewriterText({ text, speed = 6 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && text && <span className="cursor">▋</span>}
    </span>
  );
}

// ── Main PolicyDrafter Component ──────────────────────────────

export default function PolicyDrafter() {
  const [sector,     setSector]     = useState(null);
  const [policyType, setPolicyType] = useState("");
  const [citySize,   setCitySize]   = useState("");
  const [tone,       setTone]       = useState("");
  const [cityName,   setCityName]   = useState("");
  const [challenge,  setChallenge]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState("");
  const [error,      setError]      = useState("");
  const [step,       setStep]       = useState(1);
  const [copied,     setCopied]     = useState(false);
  const outputRef = useRef(null);

  const selectedSector = POLICY_SECTORS.find(s => s.id === sector);

  // ── API Call ─────────────────────────────────────────────────
  // Calls our Vercel serverless function at /api/generate
  // which securely forwards the request to Anthropic.

  async function generatePolicy() {
    if (!sector || !policyType || !citySize || !tone || !cityName || !challenge) {
      setError("Please fill in all fields before generating.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    setStep(3);

    const prompt = `You are an expert urban policy analyst and government document writer.
Draft a professional ${policyType} for the ${selectedSector?.label} sector.

City/Municipality: ${cityName}
City Size: ${citySize}
Policy Type: ${policyType}
Tone: ${tone}
Core Challenge to Address: ${challenge}

Write a comprehensive, realistic policy document with the following structure:
1. Executive Summary (2-3 sentences)
2. Problem Statement & Urban Context
3. Policy Objectives (3-5 bullet points)
4. Strategic Interventions & Action Items (detailed, numbered)
5. Implementation Timeline (phases with milestones)
6. Budget Estimate & Funding Sources
7. Key Performance Indicators (KPIs)
8. Stakeholder Responsibilities
9. Risk Assessment & Mitigation
10. Conclusion

Make it specific, data-aware, and actionable. Use real-world policy language.
Tailor it to a ${citySize} context. Tone: ${tone}.`;

    try {
      // NOTE: Calls /api/generate (our proxy), NOT Anthropic directly.
      // This keeps the API key secure on the server side.
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content
        ?.map(block => block.text || "")
        .join("\n") || "No content returned.";

      setResult(text);

      // Scroll to result after generation
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err) {
      setError("Failed to generate policy. Please check your connection and try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setSector(null); setPolicyType(""); setCitySize("");
    setTone(""); setCityName(""); setChallenge("");
    setResult(""); setError(""); setStep(1);
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0f1a",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d0",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cursor { animation: blink 0.7s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .sector-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 14px 12px;
          cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px; text-align: center;
        }
        .sector-card:hover  { background: rgba(255,255,255,0.09); transform: translateY(-2px); }
        .sector-card.active { border-color: #c9a84c; background: rgba(201,168,76,0.1); }
        select, input, textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px; color: #e8e0d0;
          font-family: 'Georgia', serif; font-size: 14px;
          padding: 10px 14px; width: 100%; outline: none; transition: border 0.2s;
        }
        select:focus, input:focus, textarea:focus { border-color: #c9a84c; }
        select option { background: #151926; }
        .btn-primary {
          background: linear-gradient(135deg, #c9a84c, #a07830);
          border: none; border-radius: 6px; color: #0b0f1a;
          cursor: pointer; font-family: 'Georgia', serif;
          font-size: 15px; font-weight: bold; padding: 13px 32px;
          transition: all 0.2s; letter-spacing: 0.5px;
        }
        .btn-primary:hover    { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px; color: #b0a898;
          cursor: pointer; font-family: 'Georgia', serif;
          font-size: 13px; padding: 9px 20px; transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #c9a84c; color: #c9a84c; }
        .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #8a7f6e; margin-bottom: 8px; }
        .result-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 10px; padding: 28px;
          font-size: 14px; line-height: 1.85; white-space: pre-wrap;
          color: #ddd5c4; font-family: 'Georgia', serif;
          max-height: 520px; overflow-y: auto;
        }
        .result-box::-webkit-scrollbar       { width: 4px; }
        .result-box::-webkit-scrollbar-track { background: transparent; }
        .result-box::-webkit-scrollbar-thumb { background: #c9a84c44; border-radius: 4px; }
        .spinner {
          width: 32px; height: 32px;
          border: 2px solid rgba(201,168,76,0.2);
          border-top-color: #c9a84c; border-radius: 50%;
          animation: spin 0.8s linear infinite; margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: all 0.3s; }
        .step-dot.active { background: #c9a84c; box-shadow: 0 0 8px #c9a84c88; }
        .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 24px 0; }
        .tag {
          display: inline-block;
          background: rgba(201,168,76,0.15);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 4px; color: #c9a84c;
          font-size: 11px; letter-spacing: 1px;
          padding: 3px 9px; text-transform: uppercase;
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "22px 40px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #c9a84c, #7a5c1e)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🏛️</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: "bold", letterSpacing: "0.5px" }}>UrbanPolicy AI</div>
            <div style={{ fontSize: 11, color: "#6e6458", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Generative Policy Drafting
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1,2,3].map(n => <div key={n} className={`step-dot ${step >= n ? "active" : ""}`} />)}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 24px" }}>

        {/* Step 1: Sector Selection */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: "#c9a84c", color: "#0b0f1a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: "bold",
            }}>1</div>
            <div style={{ fontSize: 16 }}>Select Urban Policy Sector</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {POLICY_SECTORS.map(s => (
              <div
                key={s.id}
                className={`sector-card ${sector === s.id ? "active" : ""}`}
                onClick={() => { setSector(s.id); setStep(Math.max(step, 2)); }}
              >
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: sector === s.id ? "#c9a84c" : "#9a8f80", lineHeight: 1.3 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Step 2: Configuration */}
        <div style={{ marginBottom: 36, opacity: sector ? 1 : 0.4, transition: "opacity 0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: step >= 2 ? "#c9a84c" : "rgba(255,255,255,0.1)",
              color: step >= 2 ? "#0b0f1a" : "#666",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: "bold", transition: "all 0.3s",
            }}>2</div>
            <div style={{ fontSize: 16 }}>Configure Policy Parameters</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div className="label">City / Municipality Name</div>
              <input type="text" placeholder="e.g. Austin, Texas"
                value={cityName} onChange={e => setCityName(e.target.value)} disabled={!sector} />
            </div>
            <div>
              <div className="label">City Size</div>
              <select value={citySize} onChange={e => setCitySize(e.target.value)} disabled={!sector}>
                <option value="">Select city size...</option>
                {CITY_SIZES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div className="label">Policy Document Type</div>
              <select value={policyType} onChange={e => setPolicyType(e.target.value)} disabled={!sector}>
                <option value="">Select document type...</option>
                {POLICY_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div className="label">Document Tone & Audience</div>
              <select value={tone} onChange={e => setTone(e.target.value)} disabled={!sector}>
                <option value="">Select tone...</option>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="label">Core Urban Challenge to Address</div>
            <textarea rows={3}
              placeholder="Describe the specific problem this policy should solve..."
              value={challenge} onChange={e => setChallenge(e.target.value)}
              disabled={!sector} style={{ resize: "vertical" }} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(193,18,31,0.1)", border: "1px solid rgba(193,18,31,0.3)",
            borderRadius: 6, padding: "10px 16px", color: "#ff6b6b", fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {/* Generate Button */}
        {!result && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn-primary" onClick={generatePolicy}
              disabled={loading || !sector || !policyType || !citySize || !tone || !cityName || !challenge}>
              {loading ? "Drafting Policy..." : "⚡ Generate Policy Document"}
            </button>
            {(sector || policyType) && (
              <button className="btn-secondary" onClick={reset}>Reset</button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ marginBottom: 16 }} />
            <div style={{ color: "#8a7f6e", fontSize: 13, letterSpacing: "1px" }}>
              Drafting your {policyType} for {cityName}...
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div ref={outputRef} style={{ marginTop: 8 }}>
            <div className="divider" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="tag">{selectedSector?.label}</span>
                <span className="tag">{policyType}</span>
                <span style={{ color: "#6e6458", fontSize: 12 }}>{cityName}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={copyToClipboard}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button className="btn-secondary" onClick={reset}>New Document</button>
              </div>
            </div>
            <div className="result-box">
              <TypewriterText text={result} speed={6} />
            </div>
            <div style={{ marginTop: 12, color: "#5a5248", fontSize: 11, letterSpacing: "1px", textAlign: "right" }}>
              GENERATED BY URBANPOLICY AI · FOR REVIEW & REFINEMENT BY DOMAIN EXPERTS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

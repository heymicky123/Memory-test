import { useState, useRef, useEffect } from "react";

// Each entry: start time in ms, text is the phrase
const SRT = [
  { start: 180,   text: "We moved to" },
  { start: 1500,  text: "Kirribilli" },
  { start: 3315,  text: "to an" },
  { start: 3644,  text: "apartment" },
  { start: 4305,  text: "that we" },
  { start: 4605,  text: "rented." },
  { start: 5475,  text: "My memory" },
  { start: 6525,  text: "of this" },
  { start: 6915,  text: "experience" },
  { start: 7635,  text: "was" },
  { start: 7935,  text: "that it" },
  { start: 8685,  text: "completely" },
  { start: 9555,  text: "transformed" },
  { start: 10365, text: "my life" },
  { start: 10905, text: "into a" },
  { start: 11355, text: "really" },
  { start: 12285, text: "positive," },
  { start: 13035, text: "great" },
  { start: 13455, text: "experience" },
  { start: 14175, text: "because" },
  { start: 15135, text: "living in" },
  { start: 15675, text: "Kirribilli" },
  { start: 16335, text: "meant" },
  { start: 17205, text: "that I" },
  { start: 17625, text: "had to get" },
  { start: 18314, text: "a ferry" },
  { start: 19634, text: "to go to" },
  { start: 20145, text: "school." },
  { start: 21465, text: "Was seven" },
  { start: 22095, text: "minutes on" },
  { start: 22814, text: "the ferry" },
  { start: 23265, text: "to get to" },
  { start: 24375, text: "Circular" },
  { start: 24915, text: "Quay, next" },
  { start: 25695, text: "to the" },
  { start: 25935, text: "Opera" },
  { start: 26265, text: "House and" },
  { start: 26865, text: "the Harbour" },
  { start: 27314, text: "Bridge." },
  { start: 27765, text: "It was" },
  { start: 28125, text: "gorgeous" },
  { start: 29295, text: "every day" },
  { start: 30165, text: "to go to" },
  { start: 31455, text: "school" },
  { start: 31845, text: "that way." },
];

export default function OverstoryVoice() {
  const [phrases, setPhrases] = useState([]);
  const [mode, setMode] = useState("idle");
  const [showExport, setShowExport] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const timeoutsRef = useRef([]);
  const innerRef = useRef(null);
  const stageRef = useRef(null);
  const prevInnerH = useRef(0);
  const audioRef = useRef(new Audio(`${import.meta.env.BASE_URL}Ferry.m4a`));

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const replaySRT = () => {
    clearTimeouts();
    setPhrases([]);
    setOffsetY(0);
    prevInnerH.current = 0;
    setShowExport(false);
    setMode("replaying");
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();

    SRT.forEach(({ start, text }, i) => {
      const t = setTimeout(() => {
        setPhrases(prev => [...prev, { text, id: i }]);
        if (i === SRT.length - 1) {
          setTimeout(() => setMode("done"), 1000);
        }
      }, start);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    if (!innerRef.current || !stageRef.current) return;
    const stageH = stageRef.current.offsetHeight;
    const center = stageH / 2;
    const currentH = innerRef.current.scrollHeight;
    const delta = currentH - prevInnerH.current;
    prevInnerH.current = currentH;
    if (delta > 0) {
      setOffsetY(prev => Math.max(0, prev + delta - center));
    }
  }, [phrases]);

  useEffect(() => () => clearTimeouts(), []);

  const transcript = SRT.map(s => s.text).join(" ");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FCFBF8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "40px 24px",
      boxSizing: "border-box",
      position: "relative",
    }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", boxSizing: "border-box" }}>

        <div style={{ marginBottom: "56px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#9B8E7E", marginBottom: "10px" }}>
            Overstory
          </div>
          <div style={{ width: "28px", height: "1px", backgroundColor: "#C4B89A" }} />
        </div>

        {mode === "done" ? (
          <div style={{
            maxHeight: "280px",
            overflowY: "auto",
            marginBottom: "56px",
            fontSize: "19px",
            color: "#000000",
            lineHeight: 1.75,
            wordBreak: "keep-all",
            overflowWrap: "break-word",
            padding: "4px 0 24px",
            animation: "fadeUp 0.4s ease-out",
          }}>
            {phrases.map(phrase => (
              <span key={phrase.id} style={{ display: "inline-block", marginRight: "0.28em" }}>
                {phrase.text}
              </span>
            ))}
          </div>
        ) : (
          <div
            ref={stageRef}
            style={{
              position: "relative",
              height: "160px",
              marginBottom: "56px",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "64px",
              background: "linear-gradient(to bottom, #FCFBF8 30%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "48px",
              background: "linear-gradient(to top, #FCFBF8 20%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {phrases.length === 0 && mode === "idle" && (
              <div style={{ position: "absolute", bottom: "40px", left: 0, fontSize: "19px", color: "#C4B89A", fontStyle: "italic" }}>
                Speak a memory…
              </div>
            )}

            <div style={{
              position: "absolute",
              bottom: "32px",
              left: 0,
              right: 0,
              transform: `translateY(-${offsetY}px)`,
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <div
                ref={innerRef}
                style={{
                  fontSize: "19px",
                  color: "#000000",
                  lineHeight: 1.75,
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                }}
              >
                {phrases.map((phrase, i) => {
                  const fromEnd = phrases.length - 1 - i;
                  const opacity = fromEnd > 6
                    ? Math.max(0, 1 - (fromEnd - 6) * 0.15)
                    : 1;
                  const isNewest = i === phrases.length - 1 && mode === "replaying";
                  return (
                    <span key={phrase.id} style={{
                      display: "inline-block",
                      opacity,
                      transition: "opacity 1.4s ease",
                      animation: isNewest ? "wordIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both" : undefined,
                      marginRight: "0.28em",
                    }}>
                      {phrase.text}
                    </span>
                  );
                })}
                {mode === "replaying" && (
                  <span style={{ display: "inline-block", width: "1.5px", height: "16px", backgroundColor: "#9B8E7E", marginLeft: "2px", verticalAlign: "middle", animation: "blink 1.1s ease-in-out infinite" }} />
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={replaySRT}
            disabled={mode === "replaying"}
            style={{
              padding: "11px 22px", fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.05em",
              cursor: mode === "replaying" ? "not-allowed" : "pointer",
              opacity: mode === "replaying" ? 0.4 : 1,
              backgroundColor: "transparent", border: "1px solid #9B8E7E", color: "#000000", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (mode !== "replaying") e.currentTarget.style.backgroundColor = "#EDECE8"; }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Demo
          </button>

          {mode === "done" && (
            <button
              onClick={() => setShowExport(v => !v)}
              style={{
                padding: "11px 22px", fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.05em",
                cursor: "pointer", marginLeft: "auto",
                backgroundColor: "transparent", border: "1px solid #C4B89A", color: "#9B8E7E", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#000000"; e.currentTarget.style.borderColor = "#000000"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9B8E7E"; e.currentTarget.style.borderColor = "#C4B89A"; }}
            >
              Export →
            </button>
          )}
        </div>

        {showExport && (
          <div style={{
            marginTop: "40px", padding: "28px 32px",
            backgroundColor: "#EDECE8", borderLeft: "2px solid #C4B89A",
            animation: "fadeUp 0.3s ease-out",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#9B8E7E", marginBottom: "14px" }}>Transcript</div>
            <p style={{ fontSize: "15px", color: "#000000", lineHeight: 1.9, margin: "0 0 20px", fontStyle: "italic" }}>"{transcript}"</p>
            <button
              onClick={() => navigator.clipboard.writeText(transcript)}
              style={{ padding: "9px 20px", fontFamily: "Georgia, serif", fontSize: "12px", letterSpacing: "0.08em", cursor: "pointer", backgroundColor: "transparent", border: "1px solid #9B8E7E", color: "#000000" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E5E3DE"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >Copy</button>
          </div>
        )}
      </div>

      <style>{`
        * { word-break: keep-all; }
        @keyframes wordIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}

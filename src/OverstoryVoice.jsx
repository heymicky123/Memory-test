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

const PAGES = Array.from({ length: 18 });
const CURRENT_PAGE = 4;

const BAR_COUNT = 60; // 60 bars @ 2px wide, step=5px, total=297px
const BAR_HEIGHTS = (() => {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const t = i / BAR_COUNT;
    const slow = (Math.sin(t * Math.PI * 4) + 1) / 2;
    const fast = (Math.sin(t * Math.PI * 18) + 1) / 2;
    const noise = rand();
    return Math.round(4 + (slow * 0.3 + fast * 0.3 + noise * 0.4) * 24);
  });
})();

export default function OverstoryVoice() {
  const [phrases, setPhrases] = useState([]);
  const [mode, setMode] = useState("idle");
  const [offsetY, setOffsetY] = useState(0);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef([]);
  const innerRef = useRef(null);
  const stageRef = useRef(null);
  const prevInnerH = useRef(0);
  const audioRef = useRef(new Audio(`${import.meta.env.BASE_URL}Ferry.m4a`));
  const rafRef = useRef(null);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const replaySRT = () => {
    clearTimeouts();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhrases([]);
    setOffsetY(0);
    setProgress(0);
    prevInnerH.current = 0;
    setMode("replaying");
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();

    const loop = () => {
      if (audio.paused || audio.ended) { rafRef.current = null; return; }
      setProgress(audio.currentTime / (audio.duration || 1));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

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

  useEffect(() => () => {
    clearTimeouts();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#1A1A18",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      boxSizing: "border-box",
      gap: "32px",
    }}>

      <button
        onClick={replaySRT}
        disabled={mode === "replaying"}
        style={{
          fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.05em",
          cursor: mode === "replaying" ? "not-allowed" : "pointer",
          opacity: mode === "replaying" ? 0.4 : 1,
          backgroundColor: "transparent", border: "none", color: "#7B7B74",
          padding: "0", transition: "opacity 0.15s",
        }}
      >
        Demo
      </button>

      {/* Phone shell */}
      <div style={{
        width: "390px",
        height: "844px",
        borderRadius: "50px",
        backgroundColor: "#1C1C1A",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Screen */}
        <div style={{
          height: "100%",
          backgroundColor: "#FCFBF8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          padding: "0 24px 80px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}>

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          }} />

          {/* Nav bar */}
          <div style={{
            width: "100%", flexShrink: 0, marginTop: "20px",
            height: "44px", display: "grid", gridTemplateColumns: "40px 1fr 40px",
            alignItems: "center", padding: "0 20px", boxSizing: "border-box",
            position: "relative", zIndex: 3,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3A3530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11,3 5,9 11,15" />
            </svg>
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: 400, color: "#3A3530" }}>
              Moving to Kirribilli
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                backgroundColor: "#FFFFFF", boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#3A3530" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z"/>
                  <line x1="8" y1="4" x2="10" y2="6"/>
                </svg>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", boxSizing: "border-box", padding: "40px 32px 0", marginTop: "auto", marginBottom: "auto" }}>

            <div style={{ marginBottom: "40px", backgroundColor: "#F2E7DA", padding: "16px" }}>
              <img
                src={`${import.meta.env.BASE_URL}Memory_test_ferry.gif`}
                alt=""
                style={{ width: "100%", display: "block" }}
              />
            </div>

            <div
              ref={stageRef}
              style={{
                position: "relative",
                height: "160px",
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
                <div style={{ position: "absolute", bottom: "40px", left: 0, fontSize: "17px", color: "#C4B89A", fontStyle: "italic" }}>
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
                    fontSize: "17px",
                    color: "#000000",
                    lineHeight: 1.75,
                    wordBreak: "keep-all",
                    overflowWrap: "break-word",
                  }}
                >
                  {phrases.map((phrase, i) => {
                    const fromEnd = phrases.length - 1 - i;
                    const opacity = mode === "done"
                      ? 1
                      : fromEnd > 6
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

          </div>

          {/* Waveform progress */}
          <div style={{
            position: "absolute", bottom: "40px", left: "24px", right: "24px",
            height: "32px", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 5,
          }}>
            <div style={{ position: "relative", width: "297px", height: "32px" }}>
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${i * 5}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "2px",
                  height: `${h}px`,
                  borderRadius: "1px",
                  backgroundColor: i / BAR_COUNT < progress ? "#6B5E4E" : "#DDD8D0",
                }} />
              ))}
            </div>
          </div>

          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "none", pointerEvents: "none", zIndex: 10,
          }}>
            <div style={{
              width: "100%", maxWidth: "420px", padding: "0 32px",
              boxSizing: "border-box", display: "flex",
              justifyContent: "space-between", alignItems: "flex-end",
            }}>
              {PAGES.map((_, i) => (
                <div key={i} style={{
                  width: "1.5px", flexShrink: 0,
                  height: i === CURRENT_PAGE ? "40px" : "20px",
                  backgroundColor: i === CURRENT_PAGE ? "#000000" : "#D4CCC2",
                }} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        html, body { margin: 0; padding: 0; background: #1A1A18; }
        * { word-break: keep-all; }
        @keyframes wordIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}

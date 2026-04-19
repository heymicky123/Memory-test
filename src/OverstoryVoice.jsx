import { useState, useRef, useEffect } from "react";

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

function makeWaveBars(count = 120) {
  const bars = [];
  let s = 0x9E3779B9;
  const rand = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    const env =
      0.55 + 0.35 * Math.sin(i * 0.18) +
      0.18 * Math.sin(i * 0.41 + 1.3) +
      0.10 * Math.sin(i * 0.91 + 0.6);
    const noise = rand();
    let v = Math.max(0.08, Math.min(1, env * 0.7 + noise * 0.55));
    if (rand() < 0.12) v *= 0.45;
    const h = 4 + v * 24;
    bars.push(h);
  }
  return bars;
}

function Waveform({ bars, progress }) {
  const BAR_W = 2;
  const GAP = 1.5;
  const H = 32;
  const width = bars.length * (BAR_W + GAP) - GAP;
  const Bars = ({ color }) => (
    <g>
      {bars.map((h, i) => {
        const x = i * (BAR_W + GAP);
        const y = (H - h) / 2;
        return <rect key={i} x={x} y={y} width={BAR_W} height={h} rx={0.8} fill={color} />;
      })}
    </g>
  );
  return (
    <div style={{ position: "relative", width: "100%", height: H }}>
      <svg viewBox={`0 0 ${width} ${H}`} preserveAspectRatio="none" width="100%" height={H} style={{ display: "block", position: "absolute", inset: 0 }}>
        <Bars color="var(--wave-base)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, width: `${Math.min(100, progress * 100)}%`, overflow: "hidden", transition: "width 60ms linear" }}>
        <svg viewBox={`0 0 ${width} ${H}`} preserveAspectRatio="none" width={`${100 / Math.max(progress, 0.0001)}%`} height={H} style={{ display: "block" }}>
          <Bars color="var(--muted)" />
        </svg>
      </div>
    </div>
  );
}

const BackChevron = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 3.5 L5.5 9 L11.5 14.5" />
  </svg>
);

const EditPencil = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12 L2 10 L9.5 2.5 L11.5 4.5 L4 12 Z" />
    <path d="M8.5 3.5 L10.5 5.5" />
  </svg>
);

export default function OverstoryVoice() {
  const [phrases, setPhrases] = useState([]);
  const [mode, setMode] = useState("idle");
  const [offsetY, setOffsetY] = useState(0);
  const [imgVisible, setImgVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef([]);
  const innerRef = useRef(null);
  const stageRef = useRef(null);
  const prevInnerH = useRef(0);
  const audioRef = useRef(new Audio(`${import.meta.env.BASE_URL}Ferry.m4a`));
  const waveBars = useRef(makeWaveBars()).current;

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const replaySRT = () => {
    clearTimeouts();
    setPhrases([]);
    setOffsetY(0);
    prevInnerH.current = 0;
    setMode("replaying");
    setImgVisible(true);
    setProgress(0);
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

  useEffect(() => {
    const audio = audioRef.current;
    const update = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  useEffect(() => () => clearTimeouts(), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@1,400&family=Source+Serif+4:wght@300;400;500&display=swap');

        :root {
          --bg-stage: #1A1A18;
          --screen: #FCFBF8;
          --mat: #F2E7DA;
          --ink: #1A1A18;
          --ink-soft: #3A3530;
          --muted: #6B5E4E;
          --hair: #C4B89A;
          --wave-base: #DDD8D0;
          --hover: #F0EBE3;
          --cursor: #9B8E7E;
        }

        * { word-break: keep-all; }
        @keyframes wordIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      `}</style>

      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-stage)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Phone shell */}
        <div style={{
          position: "relative",
          width: 390,
          height: 844,
          background: "#0E0E0D",
          borderRadius: 50,
          padding: 10,
          boxShadow: "inset 0 0 0 1px #262522, 0 30px 60px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.03)",
        }}>
          {/* Camera dot */}
          <div style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#050504",
            boxShadow: "inset 0 0 0 1px #1a1a18",
            zIndex: 3,
          }} />

          {/* Screen */}
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "var(--screen)",
            borderRadius: 42,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Nav bar */}
            <div style={{
              height: 44,
              flex: "0 0 auto",
              display: "grid",
              gridTemplateColumns: "44px 1fr 44px",
              alignItems: "center",
              padding: "0 20px",
              marginTop: 10,
            }}>
              <button style={{
                width: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                background: "transparent",
                border: "none",
                color: "var(--ink-soft)",
                cursor: "pointer",
                padding: 0,
              }}>
                <BackChevron />
              </button>
              <div style={{
                textAlign: "center",
                fontFamily: '"Source Serif 4", Georgia, serif',
                fontWeight: 300,
                fontSize: 13,
                letterSpacing: "0.01em",
                color: "var(--ink-soft)",
              }}>
                Memories
              </div>
              <button style={{
                justifySelf: "end",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "1px solid rgba(196,184,154,0.55)",
                background: "rgba(242,231,218,0.35)",
                width: 30,
                height: 30,
                color: "var(--ink-soft)",
                cursor: "pointer",
              }}>
                <EditPencil />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 32px 40px",
            }}>
              {/* Mat + Image — hidden until demo triggered */}
              <div style={{
                marginBottom: "40px",
                backgroundColor: "#F2E7DA",
                padding: "16px",
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 600ms ease, transform 600ms ease",
              }}>
                <img
                  src={`${import.meta.env.BASE_URL}Memory_test_ferry.gif`}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              {/* Stage */}
              <div
                ref={stageRef}
                style={{
                  position: "relative",
                  height: "160px",
                  marginBottom: "16px",
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

              {/* Waveform */}
              <div style={{ marginTop: 12 }}>
                <Waveform bars={waveBars} progress={progress} />
              </div>

              {/* Demo button */}
              <div style={{ display: "flex", marginTop: 16 }}>
                <button
                  onClick={replaySRT}
                  disabled={mode === "replaying"}
                  style={{
                    fontFamily: '"Source Serif 4", Georgia, serif',
                    fontWeight: 400,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    background: "transparent",
                    border: "1px solid var(--hair)",
                    padding: "8px 18px",
                    cursor: mode === "replaying" ? "not-allowed" : "pointer",
                    opacity: mode === "replaying" ? 0.4 : 1,
                    transition: "background 180ms ease",
                  }}
                  onMouseEnter={e => { if (mode !== "replaying") e.currentTarget.style.backgroundColor = "var(--hover)"; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

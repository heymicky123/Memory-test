import { useState } from "react";
import OverstoryVoice from "./OverstoryVoice";

const btnStyle = (active) => ({
  fontFamily: "Georgia, serif",
  fontSize: "13px",
  letterSpacing: "0.05em",
  background: "transparent",
  border: "none",
  padding: 0,
  color: active ? "#BFB3A4" : "#4A4A46",
  cursor: active ? "default" : "pointer",
});

export default function App() {
  const [demo, setDemo] = useState(1);
  return (
    <>
      <div style={{
        position: "fixed", top: "20px", left: "24px",
        display: "flex", gap: "20px", zIndex: 100,
      }}>
        <button onClick={() => setDemo(1)} style={btnStyle(demo === 1)}>Demo 1</button>
        <button onClick={() => setDemo(2)} style={btnStyle(demo === 2)}>Demo 2</button>
      </div>
      {demo === 1
        ? <OverstoryVoice key={1} />
        : <OverstoryVoice
            key={2}
            image="Ferry_animated.gif"
            imageStyle={{
              marginLeft: "-56px",
              marginRight: "-56px",
              padding: "0",
              marginBottom: "50px",
            }}
            imgStyle={{
              width: "calc(100% + 40px)",
              marginLeft: "-20px",
              marginTop: "-20px",
              marginBottom: "-20px",
              display: "block",
            }}
          />
      }
    </>
  );
}

// frontend/src/components/Timer.jsx
import { useEffect, useState } from "react";

export default function Timer({ duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire(duration - prev);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, onExpire]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  return <span style={{ fontWeight: 700, color: timeLeft <= 60 ? "#ef4444" : "#1f2937" }}>{minutes}:{seconds}</span>;
}
"use client";

import { useEffect, useState } from "react";

function remaining(target: string) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1_000) % 60),
  };
}

const initialTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    setTime(remaining(target));
    const timer = window.setInterval(() => setTime(remaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  return (
    <div className="puck-countdown" aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes until the convention`}>
      {Object.entries(time).map(([label, value]) => (
        <span key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></span>
      ))}
    </div>
  );
}

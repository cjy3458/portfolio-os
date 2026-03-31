import { useState, useEffect } from "react";

export function useBiosDateTime() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const fmt = (d: Date) => {
      const yy = String(d.getFullYear()).slice(2).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${yy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateTime(fmt(new Date()));
    const interval = setInterval(() => setDateTime(fmt(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  return dateTime;
}

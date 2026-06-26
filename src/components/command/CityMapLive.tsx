"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CITY_COORDS: Record<string, { x: number; y: number }> = {
  دمشق: { x: 155, y: 195 },
  حلب: { x: 175, y: 95 },
  حمص: { x: 140, y: 155 },
  اللاذقية: { x: 95, y: 130 },
  حماة: { x: 150, y: 130 },
  طرطوس: { x: 80, y: 155 },
};

interface Pulse {
  id: string;
  city: string;
  x: number;
  y: number;
}

export function CityMapLive({ initialCities }: { initialCities: string[] }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    for (const city of initialCities) {
      const coords = CITY_COORDS[city];
      if (!coords) continue;
      const id = `${city}-${Date.now()}-${Math.random()}`;
      setPulses((p) => [...p, { id, city, ...coords }].slice(-8));
    }
  }, [initialCities]);

  useEffect(() => {
    let es: EventSource | null = null;

    const onPayload = (city: string | null) => {
      if (!city || !CITY_COORDS[city]) return;
      const coords = CITY_COORDS[city];
      setPulses((p) =>
        [
          { id: `${Date.now()}`, city, ...coords },
          ...p,
        ].slice(0, 8)
      );
    };

    try {
      es = new EventSource("/api/live/redemptions");
      es.onmessage = (ev) => {
        if (!ev.data || ev.data.startsWith(":")) return;
        try {
          const data = JSON.parse(ev.data) as { city: string | null };
          onPayload(data.city);
        } catch {
          // ignore
        }
      };
    } catch {
      // no live
    }

    return () => es?.close();
  }, []);

  return (
    <div className="relative mx-auto aspect-[4/3] max-w-sm">
      <svg viewBox="0 0 220 260" className="h-full w-full">
        <rect
          x="40"
          y="50"
          width="160"
          height="200"
          rx="8"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          className="text-gold-2"
        />
        {Object.entries(CITY_COORDS).map(([name, { x, y }]) => (
          <g key={name}>
            <circle cx={x} cy={y} r="3" fill="currentColor" className="text-gold-4/50" />
            <text x={x + 6} y={y + 3} className="fill-dim text-[8px]">
              {name}
            </text>
          </g>
        ))}
        <AnimatePresence>
          {pulses.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-gold-1"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}

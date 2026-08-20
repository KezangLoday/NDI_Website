"use client";

import { useEffect, useRef } from "react";

const MASK = "radial-gradient(125% 120% at 74% 20%, #000 30%, transparent 68%)";

/** Scatter 4–6 filled cells, capped at two per row and two per column so they never line up into a straight run. */
function scatter(): string {
  const count = 4 + Math.floor(Math.random() * 3);
  const used = new Set<string>();
  const rows: Record<number, number> = {};
  const cols: Record<number, number> = {};
  let html = "";

  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let y = 0;
    let key = "";
    let guard = 0;
    do {
      x = 4 + Math.floor(Math.random() * 5);
      y = 1 + Math.floor(Math.random() * 4);
      key = `${x}:${y}`;
      guard += 1;
    } while ((used.has(key) || (rows[y] ?? 0) >= 2 || (cols[x] ?? 0) >= 2) && guard < 30);

    used.add(key);
    rows[y] = (rows[y] ?? 0) + 1;
    cols[x] = (cols[x] ?? 0) + 1;
    const opacity = (0.14 + Math.random() * 0.16).toFixed(2);
    html +=
      `<span style="position:absolute;width:29px;height:29px;left:${x * 30}px;top:${y * 30}px;` +
      `background:rgba(90,201,148,${opacity})"></span>`;
  }

  return html;
}

/** The skewed wireframe decoration inside each mega-menu card, which slides up on hover. */
export function GridPattern({ reroll = 0 }: { reroll?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = scatter();
  }, [reroll]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
    >
      <div className="absolute -inset-[30%]" style={{ transform: "skewY(-12deg)" }}>
        <div
          ref={ref}
          className="ndi-gc-pattern absolute inset-0"
          style={{ backgroundImage: "var(--grid-bg)", backgroundSize: "30px 30px" }}
        />
      </div>
    </div>
  );
}

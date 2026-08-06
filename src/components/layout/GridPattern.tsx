const MASK = "radial-gradient(125% 120% at 74% 20%, #000 30%, transparent 68%)";

interface Cell {
  x: number;
  y: number;
  opacity: string;
}

/** Small deterministic PRNG, so a given seed always yields the same layout. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * 4–6 filled cells, capped at two per row and two per column so they never
 * line up into a straight run.
 */
function generateCells(seed: string): Cell[] {
  const random = mulberry32(hashSeed(seed));
  const count = 4 + Math.floor(random() * 3);
  const used = new Set<string>();
  const rows: Record<number, number> = {};
  const cols: Record<number, number> = {};
  const cells: Cell[] = [];

  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let y = 0;
    let key = "";
    let guard = 0;
    do {
      x = 4 + Math.floor(random() * 5);
      y = 1 + Math.floor(random() * 4);
      key = `${x}:${y}`;
      guard += 1;
    } while ((used.has(key) || (rows[y] ?? 0) >= 2 || (cols[x] ?? 0) >= 2) && guard < 30);

    used.add(key);
    rows[y] = (rows[y] ?? 0) + 1;
    cols[x] = (cols[x] ?? 0) + 1;
    cells.push({ x, y, opacity: (0.14 + random() * 0.16).toFixed(2) });
  }

  return cells;
}

/**
 * The skewed wireframe decoration inside each mega-menu card, which slides up
 * on hover.
 *
 * The prototype scattered these cells with Math.random() on mount. Here the
 * scatter is derived from a per-card seed instead: each card still gets its own
 * arrangement, but it is stable across renders, so the markup can be produced
 * on the server without a hydration mismatch.
 */
export function GridPattern({ seed }: { seed: string }) {
  const cells = generateCells(seed);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
    >
      <div className="absolute -inset-[30%]" style={{ transform: "skewY(-12deg)" }}>
        <div
          className="ndi-gc-pattern absolute inset-0"
          style={{ backgroundImage: "var(--grid-bg)", backgroundSize: "30px 30px" }}
        >
          {cells.map((cell) => (
            <span
              key={`${cell.x}:${cell.y}`}
              className="absolute h-[29px] w-[29px]"
              style={{
                left: cell.x * 30,
                top: cell.y * 30,
                background: `rgba(90,201,148,${cell.opacity})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

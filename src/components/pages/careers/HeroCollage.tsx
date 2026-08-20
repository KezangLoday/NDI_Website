import type { CSSProperties } from "react";

/** The Careers hero collage: photographs of the team, scattered. */

interface Tile {
  /** Percent of the container. Negative and >100 values bleed off the edge. */
  x: number;
  y: number;
  w: number;
  /** width / height, which sets the crop. */
  ratio: number;
  rotate: number;
  /** The photograph this tile is holding space for. */
  caption: string;
  /** Runs off the edge of the window in the scattered layout, so its caption is suppressed there — a clipped half-word reads as a bug. */
  bleed?: boolean;
}

const TILES: Tile[] = [
  { x: -3.3, y: 12, w: 8.8, ratio: 0.66, rotate: -3, caption: "Thimphu office", bleed: true },
  { x: 4.6, y: 0, w: 16.3, ratio: 0.83, rotate: -4, caption: "Engineering standup" },
  { x: 12.5, y: 43.5, w: 17.5, ratio: 1.45, rotate: -1, caption: "Wallet user testing" },
  { x: 9.8, y: 72, w: 9.8, ratio: 0.76, rotate: 2, caption: "Onboarding day" },
  { x: 25.8, y: 10.5, w: 16.3, ratio: 0.78, rotate: 3, caption: "Design review" },
  { x: 54.2, y: 10.5, w: 20, ratio: 1.37, rotate: 1, caption: "All-hands, Thimphu" },
  { x: -2.5, y: 52, w: 7.9, ratio: 0.54, rotate: 4, caption: "Corridor", bleed: true },
  { x: 22.9, y: 73, w: 12.9, ratio: 1.48, rotate: -2, caption: "Partner workshop" },
  { x: 42.4, y: 20, w: 10.8, ratio: 0.87, rotate: -3, caption: "Support desk" },
  { x: 38.3, y: 61.7, w: 14.6, ratio: 0.81, rotate: 2, caption: "Release night" },
  { x: 55, y: 47.8, w: 12.9, ratio: 0.65, rotate: -1, caption: "Portrait, design" },
  { x: 66.7, y: 71.3, w: 12.9, ratio: 1.48, rotate: 3, caption: "Field research" },
  { x: 73.5, y: 43.5, w: 12.1, ratio: 0.94, rotate: -2, caption: "Trashigang rollout" },
  { x: 77.9, y: 1.7, w: 15.8, ratio: 0.76, rotate: 1, caption: "Portrait, engineering" },
  { x: 86.5, y: 56.5, w: 11.7, ratio: 0.72, rotate: 2, caption: "Team offsite" },
  { x: 96.3, y: 21.7, w: 5, ratio: 0.43, rotate: -3, caption: "Studio", bleed: true },
];

export function HeroCollage() {
  return (
    <div className="ndi-collage" aria-hidden="true">
      {TILES.map((tile, index) => (
        <div
          key={tile.caption}
          className="ndi-collage-tile"
          data-bleed={tile.bleed ? "1" : undefined}
          style={
            {
              "--x": tile.x,
              "--y": tile.y,
              "--w": tile.w,
              "--ar": tile.ratio,
              "--r": tile.rotate,
              "--i": index,
            } as CSSProperties
          }
        >
          <div className="ndi-collage-pane">
            {/* preserveAspectRatio="none" lands the diagonals on the corners whatever crop the tile happens to be. */}
            <svg
              className="ndi-collage-slash"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <path d="M0 0 L100 100 M100 0 L0 100" />
            </svg>
            <span className="ndi-collage-cap font-mono">{tile.caption}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

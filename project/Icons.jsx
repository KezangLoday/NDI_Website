// Lightweight line-icon set (Lucide-style, 1.8 stroke) for NDI kits.
// Exported to window for use across kit JSX files.
const _i = (paths, vb = "0 0 24 24") => ({ size = 22, color = "currentColor", strokeWidth = 1.8, style = {} } = {}) =>
  React.createElement("svg", { width: size, height: size, viewBox: vb, fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style },
    paths.map((d, i) => React.createElement("path", { key: i, d })));

const _multi = (els, vb = "0 0 24 24") => ({ size = 22, color = "currentColor", strokeWidth = 1.8, style = {} } = {}) =>
  React.createElement("svg", { width: size, height: size, viewBox: vb, fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style }, els);

const Icons = {
  shield: _i(["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "m9 12 2 2 4-4"]),
  wallet: _multi([
    React.createElement("path", { key: 0, d: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" }),
    React.createElement("path", { key: 1, d: "M16 12h6v4h-6a2 2 0 0 1 0-4Z" }),
  ]),
  fingerprint: _i([
    "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",
    "M14 13.12c0 2.38 0 6.38-1 8.88",
    "M17.29 21.02c.12-.6.43-2.3.5-3.02",
    "M2 12a10 10 0 0 1 18-6",
    "M2 16h.01",
    "M21.8 16c.2-2 .131-5.354 0-6",
    "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",
    "M8.65 22c.21-.66.45-1.32.57-2",
    "M9 6.8a6 6 0 0 1 9 5.2v2",
  ]),
  globe: _multi([
    React.createElement("circle", { key: 0, cx: 12, cy: 12, r: 10 }),
    React.createElement("path", { key: 1, d: "M2 12h20" }),
    React.createElement("path", { key: 2, d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" }),
  ]),
  key: _multi([
    React.createElement("circle", { key: 0, cx: 7.5, cy: 15.5, r: 4.5 }),
    React.createElement("path", { key: 1, d: "m10.5 12.5 8-8" }),
    React.createElement("path", { key: 2, d: "m16 6 3 3" }),
    React.createElement("path", { key: 3, d: "m18 4 3 3" }),
  ]),
  qr: _multi([
    React.createElement("rect", { key: 0, x: 3, y: 3, width: 7, height: 7, rx: 1 }),
    React.createElement("rect", { key: 1, x: 14, y: 3, width: 7, height: 7, rx: 1 }),
    React.createElement("rect", { key: 2, x: 3, y: 14, width: 7, height: 7, rx: 1 }),
    React.createElement("path", { key: 3, d: "M14 14h3v3h-3z M21 14v.01 M14 21v.01 M17 21h4v-4" }),
  ]),
  layers: _i(["m12 2 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 17 9 5 9-5"]),
  bolt: _i(["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"]),
  lock: _multi([
    React.createElement("rect", { key: 0, x: 3, y: 11, width: 18, height: 11, rx: 2 }),
    React.createElement("path", { key: 1, d: "M7 11V7a5 5 0 0 1 10 0v4" }),
  ]),
  check: _i(["M20 6 9 17l-5-5"]),
  arrowRight: _i(["M5 12h14", "m12 5 7 7-7 7"]),
  menu: _i(["M3 6h18", "M3 12h18", "M3 18h18"]),
  building: _multi([
    React.createElement("rect", { key: 0, x: 4, y: 2, width: 16, height: 20, rx: 1 }),
    React.createElement("path", { key: 1, d: "M9 22v-4h6v4 M8 6h.01 M12 6h.01 M16 6h.01 M8 10h.01 M12 10h.01 M16 10h.01 M8 14h.01 M16 14h.01" }),
  ]),
  code: _i(["m16 18 6-6-6-6", "m8 6-6 6 6 6"]),
  users: _multi([
    React.createElement("path", { key: 0, d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { key: 1, cx: 9, cy: 7, r: 4 }),
    React.createElement("path", { key: 2, d: "M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" }),
  ]),
  send: _i(["M22 2 11 13", "M22 2 15 22l-4-9-9-4 20-7Z"]),
  scan: _i(["M3 7V5a2 2 0 0 1 2-2h2", "M17 3h2a2 2 0 0 1 2 2v2", "M21 17v2a2 2 0 0 1-2 2h-2", "M7 21H5a2 2 0 0 1-2-2v-2", "M7 12h10"]),
};
window.Icons = Icons;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only honours a `quality` prop whose value is listed here; anything
    // else silently falls back to 75. The credential cards ask for 95: they are
    // read at 370px wide but carry 14px-equivalent body text, and a second
    // generation of lossy encoding lands squarely on those thin strokes.
    qualities: [75, 95],
  },
};

export default nextConfig;

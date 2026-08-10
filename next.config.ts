import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only honours a `quality` prop whose value is listed here; anything
    // else silently falls back to 75. The credential-card artwork is a 300px
    // source shown at ~370px, so it is upscaled before it ever reaches the
    // screen — a lossy re-encode on top of that is what makes it look mushy,
    // and 95 keeps the optimiser from adding a second generation of loss.
    qualities: [75, 95],
  },
};

export default nextConfig;

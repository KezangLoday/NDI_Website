import { AppleLogo, GooglePlayLogo } from "./icons";

const APPLE_STACK = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
const ROBOTO_STACK = "Roboto, Arial, Helvetica, sans-serif";

interface StoreButtonProps {
  href: string;
  label: string;
  logo: React.ReactNode;
  smallText: string;
  smallStyle: React.CSSProperties;
  largeText: string;
  largeStyle: React.CSSProperties;
}

function StoreButton({
  href,
  label,
  logo,
  smallText,
  smallStyle,
  largeText,
  largeStyle,
}: StoreButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="ndi-store relative inline-flex items-center gap-[10px] overflow-hidden rounded-[9px] border border-white/[0.28] bg-black py-[9px] pl-[14px] pr-4 text-strong"
      style={{ boxShadow: "0 12px 30px -22px rgba(0,0,0,0.9)" }}
    >
      <span className="ndi-store-sweep" />
      <span className="ndi-store-glow" />
      <span className="ndi-store-icon relative z-[1] inline-flex h-[30px] flex-none items-center justify-center text-white">
        {logo}
      </span>
      <span className="relative z-[1] flex flex-col gap-px text-left">
        <span style={smallStyle}>{smallText}</span>
        <span style={largeStyle}>{largeText}</span>
      </span>
    </a>
  );
}

export function StoreButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <StoreButton
        href="#"
        label="Download Bhutan NDI on the App Store"
        logo={<AppleLogo />}
        smallText="Download on the"
        smallStyle={{
          fontFamily: APPLE_STACK,
          fontSize: 10,
          letterSpacing: "0.01em",
          color: "#ffffff",
        }}
        largeText="App Store"
        largeStyle={{
          fontFamily: APPLE_STACK,
          fontWeight: 500,
          fontSize: 19,
          lineHeight: 1.06,
          letterSpacing: "-0.01em",
          color: "#ffffff",
        }}
      />
      <StoreButton
        href="#"
        label="Get Bhutan NDI on Google Play"
        logo={<GooglePlayLogo />}
        smallText="GET IT ON"
        smallStyle={{
          fontFamily: ROBOTO_STACK,
          fontSize: 9,
          letterSpacing: "0.09em",
          color: "#ffffff",
        }}
        largeText="Google Play"
        largeStyle={{
          fontFamily: ROBOTO_STACK,
          fontWeight: 500,
          fontSize: 18,
          lineHeight: 1.06,
          color: "#ffffff",
        }}
      />
    </div>
  );
}

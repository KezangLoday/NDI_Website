/* @ds-bundle: {"format":3,"namespace":"BhutanNDIDesignSystem_fabd6a","components":[{"name":"CredentialCard","sourcePath":"components/brand/CredentialCard.jsx"},{"name":"FeatureCard","sourcePath":"components/brand/FeatureCard.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"MonoLabel","sourcePath":"components/data-display/MonoLabel.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Accordion","sourcePath":"components/navigation/Accordion.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/CredentialCard.jsx":"54478658549e","components/brand/FeatureCard.jsx":"3e9947bba0a2","components/brand/Logo.jsx":"5918f37af3cd","components/data-display/Avatar.jsx":"32da0de8aae9","components/data-display/Badge.jsx":"ba8e6454963c","components/data-display/Card.jsx":"c3a0ff20c495","components/data-display/MonoLabel.jsx":"8a5194972917","components/feedback/Dialog.jsx":"9d157d193d1d","components/feedback/ProgressBar.jsx":"2cc7ad762ad4","components/feedback/Toast.jsx":"001249ef6c5c","components/forms/Button.jsx":"0b31475544ff","components/forms/Checkbox.jsx":"f1adaa8db092","components/forms/IconButton.jsx":"4749d82d861d","components/forms/Input.jsx":"a07757a6afd7","components/forms/Select.jsx":"43bb73d0ecb9","components/forms/Switch.jsx":"1635b36a807e","components/navigation/Accordion.jsx":"9872cc9a1742","components/navigation/Tabs.jsx":"c12cdf7f3969","ui_kits/app/App.jsx":"345030faa696","ui_kits/website/Icons.jsx":"ff9917576843","ui_kits/website/Pages.jsx":"232df8d34177","ui_kits/website/Site.jsx":"4061604c61b3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BhutanNDIDesignSystem_fabd6a = window.BhutanNDIDesignSystem_fabd6a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/CredentialCard.jsx
try { (() => {
/**
 * CredentialCard — a verifiable credential as it appears in the NDI wallet.
 * Signature brand object: frosted teal glass, a curved light sweep, mint glow,
 * glass status badges, mono metadata. Matches the "Foundational ID" wallet card.
 */
function CredentialCard({
  title = "Foundational ID",
  issuer = "Royal Government of Bhutan",
  holder = null,
  credentialId = null,
  status = "verified",
  emblem = null,
  // national emblem / issuer mark (img src)
  starred = true,
  // show the mint favourite star
  style = {}
}) {
  const statusMap = {
    verified: {
      color: "var(--accent)",
      glow: true
    },
    pending: {
      color: "var(--ndi-warning, #f5b945)",
      glow: false
    },
    expired: {
      color: "var(--ndi-danger, #f06a6a)",
      glow: false
    }
  };
  const st = statusMap[status] || statusMap.verified;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 360,
      aspectRatio: "3 / 1.85",
      maxWidth: "100%",
      borderRadius: 20,
      background: "linear-gradient(165deg, rgba(20,27,41,0.92) 0%, rgba(16,22,34,0.96) 100%)",
      border: "1px solid var(--border-grid, rgba(90,201,148,0.15))",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -24px rgba(0,0,0,0.7)",
      overflow: "hidden",
      isolation: "isolate",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      WebkitMaskImage: "radial-gradient(150% 130% at 12% -38%, #000 52%, transparent 52.4%)",
      maskImage: "radial-gradient(150% 130% at 12% -38%, #000 52%, transparent 52.4%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(150deg, rgba(90,201,148,0.16) 0%, rgba(18,65,67,0.42) 38%, rgba(54,72,92,0.32) 100%)",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      borderBottom: "1px solid rgba(255,255,255,0.08)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "radial-gradient(150% 130% at 12% -38%, transparent 51.4%, rgba(90,201,148,0.30) 52%, transparent 53.2%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -50,
      right: -40,
      width: 160,
      height: 160,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(90,201,148,0.30), transparent 68%)",
      pointerEvents: "none",
      filter: "blur(2px)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "20px 20px 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, emblem ? /*#__PURE__*/React.createElement("img", {
    src: emblem,
    alt: "",
    style: {
      width: "84%",
      height: "84%",
      objectFit: "contain"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      color: "var(--accent)"
    }
  }, "N")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 30,
      height: 30,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      clipPath: "polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      background: st.glow ? `linear-gradient(140deg, ${st.color}, rgba(18,65,67,0.9))` : "rgba(255,255,255,0.08)",
      boxShadow: st.glow ? `0 0 14px -2px ${st.color}` : "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#0c1a14",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), starred && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      background: "rgba(90,201,148,0.12)",
      border: "1px solid rgba(90,201,148,0.30)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "var(--accent)",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 21.3 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9z"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: "-0.02em",
      color: "var(--text-strong, #f2f5f4)",
      lineHeight: 1.1
    }
  }, title), issuer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted, #8a9aa0)"
    }
  }, issuer), (holder || credentialId) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      gap: 22
    }
  }, holder && /*#__PURE__*/React.createElement(Field, {
    label: "HOLDER",
    value: holder
  }), credentialId && /*#__PURE__*/React.createElement(Field, {
    label: "CREDENTIAL ID",
    value: credentialId,
    mono: true
  }))));
}
function Field({
  label,
  value,
  mono
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      letterSpacing: "0.18em",
      color: "var(--text-faint, #5d6b71)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-body, #c5cfcb)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, value));
}
Object.assign(__ds_scope, { CredentialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/CredentialCard.jsx", error: String((e && e.message) || e) }); }

// components/brand/FeatureCard.jsx
try { (() => {
/** FeatureCard — icon + title + copy tile for marketing feature grids. */
function FeatureCard({
  icon = null,
  title,
  children,
  kicker,
  href,
  style = {}
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href || undefined,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "block",
      textDecoration: "none",
      padding: 28,
      background: "var(--grad-card)",
      border: `1px solid ${hov ? "var(--border-strong)" : "var(--border-grid)"}`,
      borderRadius: "var(--radius-lg)",
      boxShadow: hov ? "var(--inset-top), var(--glow-sm)" : "var(--inset-top)",
      transform: hov ? "translateY(-4px)" : "none",
      transition: "all var(--dur) var(--ease-out)",
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 52,
      height: 52,
      borderRadius: "var(--radius-md)",
      background: "var(--ndi-mint-08)",
      border: "1px solid var(--border-grid)",
      color: "var(--accent)",
      marginBottom: 18,
      boxShadow: hov ? "var(--glow-sm)" : "none",
      transition: "box-shadow var(--dur)"
    }
  }, icon), kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginBottom: 8
    }
  }, kicker), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
/**
 * Logo — Bhutan NDI lockups. Uses the real PNG assets.
 * basePath should point at the assets/logos directory from the consuming page.
 */
function Logo({
  variant = "horizontal-white",
  height = 36,
  basePath = "assets/logos",
  style = {}
}) {
  const files = {
    "horizontal-white": "ndi-horizontal-white.png",
    "horizontal": "ndi-horizontal.png",
    "vertical-white": "ndi-vertical-white.png",
    "vertical": "ndi-vertical.png",
    "mark-green": "ndi-mark-green.png",
    "mark-white": "ndi-mark-white.png"
  };
  return /*#__PURE__*/React.createElement("img", {
    src: `${basePath}/${files[variant] || files["horizontal-white"]}`,
    alt: "Bhutan NDI",
    style: {
      height,
      width: "auto",
      display: "block",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
/** Avatar — circular, mint ring optional. Falls back to initials. */
function Avatar({
  src,
  name = "",
  size = 40,
  ring = false,
  style = {}
}) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "50%",
      background: src ? "transparent" : "var(--ndi-teal-soft)",
      color: "var(--accent)",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: size * 0.36,
      border: ring ? "2px solid var(--accent)" : "1px solid var(--border-grid)",
      boxShadow: ring ? "var(--glow-sm)" : "none",
      overflow: "hidden",
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/** Badge — small status pill. Tones map to semantic colors. */
function Badge({
  children,
  tone = "mint",
  dot = false,
  style = {}
}) {
  const tones = {
    mint: {
      bg: "var(--ndi-mint-12)",
      fg: "var(--accent)",
      bd: "var(--border-grid)"
    },
    neutral: {
      bg: "var(--ndi-ink-500)",
      fg: "var(--text-body)",
      bd: "var(--border-divider)"
    },
    info: {
      bg: "rgba(74,163,255,0.14)",
      fg: "var(--ndi-info)",
      bd: "rgba(74,163,255,0.3)"
    },
    warning: {
      bg: "rgba(245,183,64,0.14)",
      fg: "var(--ndi-warning)",
      bd: "rgba(245,183,64,0.3)"
    },
    danger: {
      bg: "var(--ndi-danger-soft)",
      fg: "var(--ndi-danger)",
      bd: "rgba(225,73,66,0.3)"
    }
  };
  const t = tones[tone] || tones.mint;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 10px",
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono-sm)",
      fontWeight: 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.fg,
      boxShadow: tone === "mint" ? "0 0 8px var(--accent)" : "none"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — glassmorphism panel with the tech-wireframe mint border.
 * The signature surface of the system: teal-tinted glass over obsidian.
 */
function Card({
  children,
  glow = false,
  hover = false,
  padding = 24,
  style = {},
  ...rest
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      position: "relative",
      background: "var(--grad-card)",
      backdropFilter: "blur(var(--blur-glass))",
      WebkitBackdropFilter: "blur(var(--blur-glass))",
      border: `1px solid ${hover && hov ? "var(--border-strong)" : "var(--border-grid)"}`,
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: glow || hover && hov ? "var(--inset-top), var(--glow-sm)" : "var(--inset-top), var(--shadow-md)",
      transition: "border-color var(--dur), box-shadow var(--dur), transform var(--dur)",
      transform: hover && hov ? "translateY(-3px)" : "none",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/MonoLabel.jsx
try { (() => {
/** MonoLabel — uppercase monospaced eyebrow/system badge with optional bracket ticks. */
function MonoLabel({
  children,
  color = "var(--accent)",
  ticks = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono-sm)",
      fontWeight: 500,
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, ticks && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: "currentColor",
      opacity: 0.5
    }
  }), children);
}
Object.assign(__ds_scope, { MonoLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/MonoLabel.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** Dialog — centered modal over a blurred scrim. Glass panel body. */
function Dialog({
  open = true,
  title,
  children,
  footer,
  onClose,
  width = 460,
  style = {}
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "rgba(8,11,17,0.7)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: "100%",
      background: "var(--grad-card)",
      backdropFilter: "blur(var(--blur-glass))",
      WebkitBackdropFilter: "blur(var(--blur-glass))",
      border: "1px solid var(--border-grid)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--inset-top), var(--shadow-lg)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
      padding: "24px 24px 0"
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "-0.02em",
      color: "var(--text-strong)"
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: "var(--ndi-ink-500)",
      border: "1px solid var(--border-divider)",
      borderRadius: 8,
      width: 32,
      height: 32,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-body)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px 0",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      padding: 24
    }
  }, footer), !footer && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/** ProgressBar — thin track with mint fill + glow. Indeterminate optional. */
function ProgressBar({
  value = 50,
  height = 6,
  glow = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height,
      borderRadius: 999,
      background: "var(--ndi-ink-500)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(0, Math.min(100, value))}%`,
      height: "100%",
      borderRadius: 999,
      background: "var(--grad-mint)",
      boxShadow: glow ? "0 0 12px rgba(90,201,148,0.5)" : "none",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/** Toast — transient notification with status accent bar. */
function Toast({
  title,
  children,
  tone = "mint",
  onClose,
  style = {}
}) {
  const tones = {
    mint: "var(--accent)",
    info: "var(--ndi-info)",
    warning: "var(--ndi-warning)",
    danger: "var(--ndi-danger)"
  };
  const c = tones[tone] || tones.mint;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      width: 360,
      maxWidth: "100%",
      padding: "16px 16px 16px 18px",
      background: "var(--surface-card)",
      border: "1px solid var(--border-grid)",
      borderLeft: `3px solid ${c}`,
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-lg)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 8px ${c}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--text-strong)"
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      background: "transparent",
      border: "none",
      color: "var(--text-faint)",
      cursor: "pointer",
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary interactive control for Bhutan NDI.
 * Mint CTA carries a micro-glow on hover; ghost/secondary use the
 * tech-wireframe mint border.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconRight = null,
  full = false,
  disabled = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const sizes = {
    sm: {
      padding: "0 14px",
      height: 36,
      font: "var(--fs-sm)",
      gap: 7
    },
    md: {
      padding: "0 20px",
      height: 44,
      font: "var(--fs-base)",
      gap: 9
    },
    lg: {
      padding: "0 28px",
      height: 54,
      font: "var(--fs-lg)",
      gap: 11
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: full ? "100%" : "auto",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: s.font,
    letterSpacing: "-0.01em",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur), transform var(--dur-fast), color var(--dur)",
    transform: press && !disabled ? "translateY(1px) scale(0.99)" : "none",
    whiteSpace: "nowrap",
    ...style
  };
  const variants = {
    primary: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--text-on-mint)",
      boxShadow: hover && !disabled ? "var(--glow-md)" : "0 1px 2px rgba(0,0,0,0.4)"
    },
    secondary: {
      background: hover ? "var(--ndi-mint-12)" : "var(--ndi-mint-08)",
      color: "var(--accent)",
      borderColor: hover ? "var(--border-strong)" : "var(--border-grid)",
      boxShadow: hover && !disabled ? "var(--glow-sm)" : "none"
    },
    ghost: {
      background: hover ? "var(--surface-hover)" : "transparent",
      color: "var(--text-body)",
      borderColor: "transparent"
    },
    outline: {
      background: "transparent",
      color: "var(--text-strong)",
      borderColor: hover ? "var(--border-strong)" : "var(--border-divider)"
    },
    danger: {
      background: hover ? "#f0584d" : "var(--ndi-danger)",
      color: "#fff",
      boxShadow: hover && !disabled ? "0 0 20px rgba(225,73,66,0.4)" : "none"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...variants[variant]
    }
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox — square check with mint fill + glow when checked. */
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {}
}) {
  const [on, setOn] = React.useState(checked);
  React.useEffect(() => setOn(checked), [checked]);
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    setOn(next);
    onChange && onChange(next);
  };
  return /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      borderRadius: 6,
      background: on ? "var(--accent)" : "var(--surface-raised)",
      border: `1.5px solid ${on ? "transparent" : "var(--border-divider)"}`,
      boxShadow: on ? "var(--glow-sm)" : "none",
      transition: "background var(--dur), box-shadow var(--dur)"
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-on-mint)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** IconButton — square icon-only control. Variants match Button. */
function IconButton({
  children,
  variant = "ghost",
  size = "md",
  disabled = false,
  "aria-label": ariaLabel = "button",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 32,
    md: 40,
    lg: 48
  }[size] || 40;
  const variants = {
    ghost: {
      background: hover ? "var(--surface-hover)" : "transparent",
      color: "var(--text-body)",
      borderColor: "transparent"
    },
    solid: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--text-on-mint)",
      borderColor: "transparent",
      boxShadow: hover ? "var(--glow-sm)" : "none"
    },
    outline: {
      background: hover ? "var(--ndi-mint-08)" : "transparent",
      color: "var(--accent)",
      borderColor: hover ? "var(--border-strong)" : "var(--border-grid)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dims,
      height: dims,
      borderRadius: "var(--radius-md)",
      border: "1.5px solid transparent",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--dur) var(--ease-out), box-shadow var(--dur), border-color var(--dur)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Input — text field with mono label option and mint focus glow. */
function Input({
  label,
  hint,
  error,
  icon = null,
  type = "text",
  mono = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? "var(--ndi-danger)" : focus ? "var(--accent)" : "var(--border-divider)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono-sm)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 48,
      padding: "0 14px",
      background: "var(--surface-raised)",
      border: `1.5px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "var(--ring)" : "none",
      transition: "border-color var(--dur), box-shadow var(--dur)"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: focus ? "var(--accent)" : "var(--text-faint)"
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--text-strong)",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
      fontSize: "var(--fs-base)",
      letterSpacing: mono ? "var(--ls-mono)" : "0",
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-xs)",
      color: error ? "var(--ndi-danger)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select — native dropdown styled to match the dark wireframe inputs. */
function Select({
  label,
  options = [],
  value,
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono-sm)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      width: "100%",
      height: 48,
      padding: "0 40px 0 14px",
      background: "var(--surface-raised)",
      color: "var(--text-strong)",
      border: `1.5px solid ${focus ? "var(--accent)" : "var(--border-divider)"}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-base)",
      outline: "none",
      boxShadow: focus ? "var(--ring)" : "none",
      cursor: "pointer",
      transition: "border-color var(--dur), box-shadow var(--dur)",
      ...style
    }
  }, rest), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value,
      style: {
        background: "var(--ndi-ink-700)"
      }
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-faint)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 14,
      top: 16,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Switch — pill toggle with mint active track + glow. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {}
}) {
  const [on, setOn] = React.useState(checked);
  React.useEffect(() => setOn(checked), [checked]);
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    setOn(next);
    onChange && onChange(next);
  };
  return /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 46,
      height: 26,
      borderRadius: 999,
      background: on ? "var(--accent)" : "var(--ndi-ink-500)",
      border: `1.5px solid ${on ? "transparent" : "var(--border-divider)"}`,
      boxShadow: on ? "var(--glow-sm)" : "none",
      transition: "background var(--dur), box-shadow var(--dur)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: on ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: on ? "var(--text-on-mint)" : "var(--ndi-100)",
      transition: "left var(--dur) var(--ease-out)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Accordion.jsx
try { (() => {
/** Accordion — FAQ disclosure with mint active state. */
function Accordion({
  items = [],
  allowMultiple = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(() => new Set());
  const toggle = i => {
    setOpen(prev => {
      const next = new Set(allowMultiple ? prev : []);
      prev.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open.has(i);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: "var(--surface-card)",
        border: `1px solid ${isOpen ? "var(--border-strong)" : "var(--border-grid)"}`,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "border-color var(--dur)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggle(i),
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        padding: "18px 20px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        color: "var(--text-strong)",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 17,
        letterSpacing: "-0.01em"
      }
    }, it.q, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: isOpen ? "var(--accent)" : "var(--ndi-mint-08)",
        color: isOpen ? "var(--text-on-mint)" : "var(--accent)",
        transition: "background var(--dur), transform var(--dur)",
        transform: isOpen ? "rotate(45deg)" : "none"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 400 : 0,
        opacity: isOpen ? 1 : 0,
        transition: "max-height var(--dur-slow) var(--ease-out), opacity var(--dur)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 20px 20px",
        fontSize: 15,
        lineHeight: 1.65,
        color: "var(--text-muted)"
      }
    }, it.a)));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs — underline tab bar with sliding mint indicator. */
function Tabs({
  tabs = [],
  value,
  onChange,
  style = {}
}) {
  const [active, setActive] = React.useState(value ?? (tabs[0] && tabs[0].id));
  React.useEffect(() => {
    if (value !== undefined) setActive(value);
  }, [value]);
  const pick = id => {
    setActive(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--border-divider)",
      ...style
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => pick(t.id),
      style: {
        position: "relative",
        padding: "12px 18px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 15,
        color: on ? "var(--text-strong)" : "var(--text-faint)",
        transition: "color var(--dur)"
      }
    }, t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 8,
        right: 8,
        bottom: -1,
        height: 2,
        borderRadius: 2,
        background: on ? "var(--accent)" : "transparent",
        boxShadow: on ? "0 0 12px var(--accent)" : "none",
        transition: "background var(--dur), box-shadow var(--dur)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
// Bhutan NDI — mobile wallet kit. Composes design-system primitives in a phone frame.
const NSA = window.BhutanNDIDesignSystem_fabd6a;
const {
  Button,
  Badge,
  MonoLabel,
  CredentialCard,
  Switch,
  ProgressBar
} = NSA;
const Ik = window.Icons;
const ALOGO = "../../assets/logos";
function Phone({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 52,
      padding: 12,
      background: "linear-gradient(160deg,#222c3d,#0c111b)",
      boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(90,201,148,0.12)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: 42,
      overflow: "hidden",
      background: "var(--surface-canvas)",
      position: "relative",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 130,
      height: 30,
      background: "#0c111b",
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      zIndex: 30
    }
  }), children));
}
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      padding: "0 26px 6px",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-strong)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Ik.bolt, {
    size: 13,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "5G")));
}
function TabBar({
  tab,
  setTab
}) {
  const tabs = [{
    id: "wallet",
    icon: Ik.wallet,
    label: "Wallet"
  }, {
    id: "scan",
    icon: Ik.scan,
    label: "Scan"
  }, {
    id: "activity",
    icon: Ik.layers,
    label: "Activity"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      display: "flex",
      borderTop: "1px solid var(--border-grid)",
      background: "rgba(12,17,27,0.9)",
      backdropFilter: "blur(12px)",
      padding: "10px 0 26px"
    }
  }, tabs.map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        flex: 1,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        color: on ? "var(--accent)" : "var(--text-faint)"
      }
    }, /*#__PURE__*/React.createElement(t.icon, {
      size: 22
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.06em"
      }
    }, t.label));
  }));
}
function Login({
  onLogin
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "0 28px",
      background: "var(--grad-depth)"
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${ALOGO}/ndi-vertical-white.png`,
    alt: "Bhutan NDI",
    style: {
      height: 120,
      marginBottom: 28
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "-0.02em",
      color: "var(--text-strong)"
    }
  }, "Your sovereign identity"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 15,
      lineHeight: 1.55,
      color: "var(--text-muted)"
    }
  }, "Unlock your wallet to access services and manage credentials.")), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    full: true,
    icon: /*#__PURE__*/React.createElement(Ik.fingerprint, {
      size: 20
    }),
    onClick: onLogin
  }, "Unlock with Face ID"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "md",
    full: true
  }, "Use passcode")));
}
function WalletScreen({
  openCred
}) {
  const creds = [{
    title: "National ID",
    issuer: "Royal Government of Bhutan",
    status: "verified"
  }, {
    title: "Driving License",
    issuer: "Road Safety & Transport",
    status: "verified"
  }, {
    title: "Degree Certificate",
    issuer: "Royal University of Bhutan",
    status: "pending"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 22px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, "Kuzuzangpo"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "4px 0 0",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 26,
      color: "var(--text-strong)"
    }
  }, "Karma Wangchuk")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "var(--ndi-teal-soft)",
      border: "1px solid var(--border-grid)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--accent)",
      fontFamily: "var(--font-display)",
      fontWeight: 600
    }
  }, "KW")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(MonoLabel, null, creds.length, " credentials"), /*#__PURE__*/React.createElement(Badge, {
    tone: "mint",
    dot: true
  }, "Synced")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "8px 22px 22px"
    }
  }, creds.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => openCred(c),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(CredentialCard, {
    title: c.title,
    issuer: c.issuer,
    status: c.status,
    logo: `${ALOGO}/ndi-horizontal-white.png`,
    style: {
      width: "100%"
    }
  })))));
}
function ScanScreen({
  onConsent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--grad-depth)"
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 24,
      color: "var(--text-strong)"
    }
  }, "Scan to connect"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "Point your camera at a service's QR code.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 230,
      height: 230,
      borderRadius: 28,
      border: "1px solid var(--border-grid)",
      background: "var(--surface-sunken)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--grid-bg)",
      backgroundSize: "24px 24px",
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement(Ik.qr, {
    size: 120,
    color: "var(--accent)",
    strokeWidth: 1.2,
    style: {
      position: "relative"
    }
  }), ["tl", "tr", "bl", "br"].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      position: "absolute",
      width: 30,
      height: 30,
      border: "3px solid var(--accent)",
      boxShadow: "0 0 12px var(--accent)",
      top: c[0] === "t" ? 14 : "auto",
      bottom: c[0] === "b" ? 14 : "auto",
      left: c[1] === "l" ? 14 : "auto",
      right: c[1] === "r" ? 14 : "auto",
      borderTop: c[0] === "b" ? "none" : undefined,
      borderBottom: c[0] === "t" ? "none" : undefined,
      borderLeft: c[1] === "r" ? "none" : undefined,
      borderRight: c[1] === "l" ? "none" : undefined,
      borderRadius: 6
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 22px 40px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    full: true,
    onClick: onConsent
  }, "Simulate scan \u2192 Royal Monetary Authority")));
}
function ConsentSheet({
  onApprove,
  onClose
}) {
  const fields = [["Full name", true], ["Date of birth", true], ["National ID number", true], ["Photograph", false]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      background: "rgba(8,11,17,0.65)",
      backdropFilter: "blur(4px)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--surface-raised)",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      border: "1px solid var(--border-grid)",
      padding: "10px 24px 36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: "var(--ndi-ink-400)",
      margin: "0 auto 18px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "var(--ndi-mint-08)",
      border: "1px solid var(--border-grid)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Ik.building, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 17,
      color: "var(--text-strong)"
    }
  }, "Royal Monetary Authority"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--accent)"
    }
  }, "Verified requester"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 12px",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "Requests to verify the following from your National ID:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 22
    }
  }, fields.map(([f, on]) => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: 12,
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, f), /*#__PURE__*/React.createElement(Switch, {
    checked: on
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    full: true,
    onClick: onClose
  }, "Decline"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    full: true,
    icon: /*#__PURE__*/React.createElement(Ik.fingerprint, {
      size: 18
    }),
    onClick: onApprove
  }, "Approve"))));
}
function ActivityScreen() {
  const log = [{
    t: "National ID verified",
    s: "Royal Monetary Authority",
    when: "2m ago",
    ok: true
  }, {
    t: "Logged in",
    s: "Citizen Services Portal",
    when: "1h ago",
    ok: true
  }, {
    t: "Credential issued",
    s: "Road Safety & Transport",
    when: "Yesterday",
    ok: true
  }, {
    t: "Verification declined",
    s: "Unknown requester",
    when: "2d ago",
    ok: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 24,
      color: "var(--text-strong)"
    }
  }, "Activity")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, log.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: 14,
      borderRadius: 14,
      background: "var(--surface-card)",
      border: "1px solid var(--border-grid)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: l.ok ? "var(--ndi-mint-08)" : "var(--ndi-danger-soft)",
      color: l.ok ? "var(--accent)" : "var(--ndi-danger)"
    }
  }, l.ok ? /*#__PURE__*/React.createElement(Ik.check, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Ik.lock, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--text-strong)"
    }
  }, l.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, l.s)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--text-faint)"
    }
  }, l.when)))));
}
window.AppParts = {
  Phone,
  Login,
  WalletScreen,
  ScanScreen,
  ConsentSheet,
  ActivityScreen,
  TabBar
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Icons.jsx
try { (() => {
// Lightweight line-icon set (Lucide-style, 1.8 stroke) for NDI kits.
// Exported to window for use across kit JSX files.
const _i = (paths, vb = "0 0 24 24") => ({
  size = 22,
  color = "currentColor",
  strokeWidth = 1.8,
  style = {}
} = {}) => React.createElement("svg", {
  width: size,
  height: size,
  viewBox: vb,
  fill: "none",
  stroke: color,
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style
}, paths.map((d, i) => React.createElement("path", {
  key: i,
  d
})));
const _multi = (els, vb = "0 0 24 24") => ({
  size = 22,
  color = "currentColor",
  strokeWidth = 1.8,
  style = {}
} = {}) => React.createElement("svg", {
  width: size,
  height: size,
  viewBox: vb,
  fill: "none",
  stroke: color,
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style
}, els);
const Icons = {
  shield: _i(["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "m9 12 2 2 4-4"]),
  wallet: _multi([React.createElement("path", {
    key: 0,
    d: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
  }), React.createElement("path", {
    key: 1,
    d: "M16 12h6v4h-6a2 2 0 0 1 0-4Z"
  })]),
  fingerprint: _i(["M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", "M14 13.12c0 2.38 0 6.38-1 8.88", "M17.29 21.02c.12-.6.43-2.3.5-3.02", "M2 12a10 10 0 0 1 18-6", "M2 16h.01", "M21.8 16c.2-2 .131-5.354 0-6", "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", "M8.65 22c.21-.66.45-1.32.57-2", "M9 6.8a6 6 0 0 1 9 5.2v2"]),
  globe: _multi([React.createElement("circle", {
    key: 0,
    cx: 12,
    cy: 12,
    r: 10
  }), React.createElement("path", {
    key: 1,
    d: "M2 12h20"
  }), React.createElement("path", {
    key: 2,
    d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"
  })]),
  key: _multi([React.createElement("circle", {
    key: 0,
    cx: 7.5,
    cy: 15.5,
    r: 4.5
  }), React.createElement("path", {
    key: 1,
    d: "m10.5 12.5 8-8"
  }), React.createElement("path", {
    key: 2,
    d: "m16 6 3 3"
  }), React.createElement("path", {
    key: 3,
    d: "m18 4 3 3"
  })]),
  qr: _multi([React.createElement("rect", {
    key: 0,
    x: 3,
    y: 3,
    width: 7,
    height: 7,
    rx: 1
  }), React.createElement("rect", {
    key: 1,
    x: 14,
    y: 3,
    width: 7,
    height: 7,
    rx: 1
  }), React.createElement("rect", {
    key: 2,
    x: 3,
    y: 14,
    width: 7,
    height: 7,
    rx: 1
  }), React.createElement("path", {
    key: 3,
    d: "M14 14h3v3h-3z M21 14v.01 M14 21v.01 M17 21h4v-4"
  })]),
  layers: _i(["m12 2 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 17 9 5 9-5"]),
  bolt: _i(["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"]),
  lock: _multi([React.createElement("rect", {
    key: 0,
    x: 3,
    y: 11,
    width: 18,
    height: 11,
    rx: 2
  }), React.createElement("path", {
    key: 1,
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  })]),
  check: _i(["M20 6 9 17l-5-5"]),
  arrowRight: _i(["M5 12h14", "m12 5 7 7-7 7"]),
  menu: _i(["M3 6h18", "M3 12h18", "M3 18h18"]),
  building: _multi([React.createElement("rect", {
    key: 0,
    x: 4,
    y: 2,
    width: 16,
    height: 20,
    rx: 1
  }), React.createElement("path", {
    key: 1,
    d: "M9 22v-4h6v4 M8 6h.01 M12 6h.01 M16 6h.01 M8 10h.01 M12 10h.01 M16 10h.01 M8 14h.01 M16 14h.01"
  })]),
  code: _i(["m16 18 6-6-6-6", "m8 6-6 6 6 6"]),
  users: _multi([React.createElement("path", {
    key: 0,
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), React.createElement("circle", {
    key: 1,
    cx: 9,
    cy: 7,
    r: 4
  }), React.createElement("path", {
    key: 2,
    d: "M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
  })]),
  send: _i(["M22 2 11 13", "M22 2 15 22l-4-9-9-4 20-7Z"]),
  scan: _i(["M3 7V5a2 2 0 0 1 2-2h2", "M17 3h2a2 2 0 0 1 2 2v2", "M21 17v2a2 2 0 0 1-2 2h-2", "M7 21H5a2 2 0 0 1-2-2v-2", "M7 12h10"])
};
window.Icons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pages.jsx
try { (() => {
// Audience sub-pages for the NDI website kit.
const {
  Button: B2,
  MonoLabel: ML2,
  FeatureCard: FC2,
  Card: C2,
  CredentialCard: CC2,
  Tabs: T2,
  Badge: BG2
} = window.BhutanNDIDesignSystem_fabd6a;
const {
  Section: Sec,
  GridBG: GBG
} = window.SiteParts;
const Ic = window.Icons;
function PageHero({
  kicker,
  title,
  sub,
  cta
}) {
  return /*#__PURE__*/React.createElement(GBG, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px 56px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement(ML2, null, kicker)), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "18px auto 0",
      maxWidth: 760,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 52,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      color: "var(--text-strong)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px auto 0",
      maxWidth: 580,
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, sub), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "flex",
      gap: 12,
      justifyContent: "center"
    }
  }, cta)));
}
function UsersPage({
  onDownload
}) {
  const items = [{
    icon: /*#__PURE__*/React.createElement(Ic.wallet, {
      size: 24
    }),
    t: "One wallet for everything",
    d: "Carry your National ID, licenses and certificates in a single secure app."
  }, {
    icon: /*#__PURE__*/React.createElement(Ic.fingerprint, {
      size: 24
    }),
    t: "Passwordless login",
    d: "Sign in to services with your face or fingerprint — no passwords to forget."
  }, {
    icon: /*#__PURE__*/React.createElement(Ic.lock, {
      size: 24
    }),
    t: "Share selectively",
    d: "Prove your age or address without revealing anything else."
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    kicker: "For Users",
    title: "Identity that belongs to you",
    sub: "Access government and private services with a tap \u2014 while keeping full control of your personal data.",
    cta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(B2, {
      variant: "primary",
      size: "lg",
      icon: /*#__PURE__*/React.createElement(Ic.wallet, {
        size: 18
      }),
      onClick: onDownload
    }, "Download Now"), /*#__PURE__*/React.createElement(B2, {
      variant: "secondary",
      size: "lg"
    }, "Watch demo"))
  }), /*#__PURE__*/React.createElement(Sec, {
    kicker: "Benefits",
    title: "Everything you need, nothing you don't"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 20
    }
  }, items.map(i => /*#__PURE__*/React.createElement(FC2, {
    key: i.t,
    icon: i.icon,
    title: i.t
  }, i.d)))));
}
function OrgsPage() {
  const items = [{
    icon: /*#__PURE__*/React.createElement(Ic.building, {
      size: 24
    }),
    t: "Issue credentials",
    d: "Become a trusted issuer and grant verifiable credentials to citizens."
  }, {
    icon: /*#__PURE__*/React.createElement(Ic.shield, {
      size: 24
    }),
    t: "Verify instantly",
    d: "Confirm identity and eligibility in seconds — no manual paperwork."
  }, {
    icon: /*#__PURE__*/React.createElement(Ic.users, {
      size: 24
    }),
    t: "Reduce fraud",
    d: "Cryptographic proofs eliminate forged documents and identity theft."
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    kicker: "For Organizations",
    title: "Issue and verify with confidence",
    sub: "Onboard customers, prevent fraud and meet compliance using verifiable credentials.",
    cta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(B2, {
      variant: "primary",
      size: "lg"
    }, "Become a partner"), /*#__PURE__*/React.createElement(B2, {
      variant: "outline",
      size: "lg"
    }, "Read the docs"))
  }), /*#__PURE__*/React.createElement(Sec, {
    kicker: "Capabilities",
    title: "Built for trusted institutions"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 20
    }
  }, items.map(i => /*#__PURE__*/React.createElement(FC2, {
    key: i.t,
    icon: i.icon,
    title: i.t
  }, i.d)))));
}
function DevsPage() {
  const snippet = `import { NDI } from "@bhutan-ndi/sdk";

const ndi = new NDI({ apiKey: process.env.NDI_KEY });

// Request a proof of National ID
const proof = await ndi.verify({
  credential: "national-id",
  attributes: ["fullName", "dateOfBirth"],
});`;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    kicker: "Developers",
    title: "Integrate trust in an afternoon",
    sub: "Open standards, clean SDKs and a sandbox that lets you issue and verify credentials fast.",
    cta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(B2, {
      variant: "primary",
      size: "lg",
      icon: /*#__PURE__*/React.createElement(Ic.code, {
        size: 18
      })
    }, "Get API keys"), /*#__PURE__*/React.createElement(B2, {
      variant: "secondary",
      size: "lg"
    }, "API reference"))
  }), /*#__PURE__*/React.createElement(Sec, {
    kicker: "Quickstart",
    title: "A few lines to verify an identity"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-grid)",
      overflow: "hidden",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-grid)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--ndi-danger)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--ndi-warning)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--text-faint)"
    }
  }, "verify.js")), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: 20,
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      lineHeight: 1.7,
      color: "var(--text-body)",
      overflowX: "auto"
    }
  }, snippet)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, [["REST & GraphQL APIs", "Issue, verify and revoke over simple endpoints."], ["W3C standards", "DIDs and Verifiable Credentials, fully interoperable."], ["Sandbox", "Test issuance and verification before going live."]].map(([t, d]) => /*#__PURE__*/React.createElement(C2, {
    key: t,
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Ic.check, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 16,
      color: "var(--text-strong)"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      marginTop: 3
    }
  }, d)))))))));
}
window.SitePages = {
  UsersPage,
  OrgsPage,
  DevsPage
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
// Bhutan NDI — marketing website kit. Composes design-system primitives.
const {
  Button,
  Badge,
  MonoLabel,
  FeatureCard,
  Card,
  Accordion,
  Tabs,
  CredentialCard
} = window.BhutanNDIDesignSystem_fabd6a;
const I = window.Icons;
const LOGO = "../../assets/logos";
function GridBG({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "var(--grad-depth)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--grid-bg)",
      backgroundSize: "var(--grid-size)",
      maskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
      WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
      pointerEvents: "none"
    }
  }), children);
}
const NAV = [{
  id: "home",
  label: "Home"
}, {
  id: "users",
  label: "For Users"
}, {
  id: "orgs",
  label: "For Organizations"
}, {
  id: "devs",
  label: "Developers"
}];
function Nav({
  page,
  setPage,
  onDownload
}) {
  const [scrolled, setScrolled] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      background: "rgba(12,17,27,0.72)",
      borderBottom: "1px solid var(--border-grid)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 32px",
      height: 72,
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${LOGO}/ndi-horizontal-white.png`,
    alt: "Bhutan NDI",
    style: {
      height: 30,
      cursor: "pointer"
    },
    onClick: () => setPage("home")
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4,
      marginLeft: 12
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => setPage(n.id),
    style: {
      padding: "8px 14px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: 14.5,
      color: page === n.id ? "var(--accent)" : "var(--text-muted)",
      transition: "color var(--dur)"
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Login"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 16
    }),
    onClick: onDownload
  }, "Get the wallet"))));
}
function Hero({
  onDownload
}) {
  return /*#__PURE__*/React.createElement(GridBG, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "96px 32px 80px",
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MonoLabel, null, "World's first SSI national identity"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "20px 0 0",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.03,
      letterSpacing: "-0.03em",
      color: "var(--text-strong)"
    }
  }, "Your secure,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--grad-text)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  }, "sovereign"), " digital identity"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "22px 0 0",
      maxWidth: 520,
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, "Take full control of your personal data and seamlessly access public and private services \u2014 built entirely on decentralized self-sovereign identity technology."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 34,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 18
    }),
    onClick: onDownload
  }, "Download Now"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(I.arrowRight, {
      size: 16
    })
  }, "Explore use cases")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 28,
      marginTop: 44
    }
  }, [["1M+", "Citizens onboarded"], ["120+", "Verified services"], ["0", "Central data stores"]].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 30,
      color: "var(--accent)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginTop: 4
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: 360,
      height: 360,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(90,201,148,0.22), transparent 70%)",
      filter: "blur(10px)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      transform: "rotate(-4deg)"
    }
  }, /*#__PURE__*/React.createElement(CredentialCard, {
    logo: `${LOGO}/ndi-horizontal-white.png`
  })))));
}
function LogoStrip() {
  const partners = ["RCSC", "RUB", "DHI", "BOB", "RMA", "TashiCell"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-grid)",
      borderBottom: "1px solid var(--border-grid)",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "26px 32px",
      display: "flex",
      alignItems: "center",
      gap: 40,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, "Trusted across government & industry"), partners.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--ndi-300)",
      letterSpacing: "0.02em"
    }
  }, p))));
}
function Section({
  kicker,
  title,
  sub,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "var(--section-y) 32px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, kicker && /*#__PURE__*/React.createElement(MonoLabel, null, kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 42,
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      color: "var(--text-strong)"
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, sub)), children);
}
function Features() {
  const items = [{
    icon: /*#__PURE__*/React.createElement(I.fingerprint, {
      size: 24
    }),
    title: "Self-sovereign",
    body: "You hold the keys. Credentials live in your wallet, never on a central server."
  }, {
    icon: /*#__PURE__*/React.createElement(I.shield, {
      size: 24
    }),
    title: "Tamper-proof",
    body: "Every credential is cryptographically signed and instantly verifiable."
  }, {
    icon: /*#__PURE__*/React.createElement(I.bolt, {
      size: 24
    }),
    title: "One-tap access",
    body: "Log in and consent to share with a single biometric tap — no passwords."
  }, {
    icon: /*#__PURE__*/React.createElement(I.globe, {
      size: 24
    }),
    title: "Interoperable",
    body: "Built on open W3C standards for verifiable credentials and DIDs."
  }, {
    icon: /*#__PURE__*/React.createElement(I.lock, {
      size: 24
    }),
    title: "Privacy by design",
    body: "Selective disclosure shares only what a service needs — nothing more."
  }, {
    icon: /*#__PURE__*/React.createElement(I.layers, {
      size: 24
    }),
    title: "One identity, everywhere",
    body: "Government, banking, education and health services in one trusted wallet."
  }];
  return /*#__PURE__*/React.createElement(Section, {
    kicker: "Why Bhutan NDI",
    title: "Digital trust, engineered for sovereignty",
    sub: "A national identity layer that puts citizens \u2014 not institutions \u2014 in control of personal data."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20
    }
  }, items.map(it => /*#__PURE__*/React.createElement(FeatureCard, {
    key: it.title,
    icon: it.icon,
    title: it.title
  }, it.body))));
}
function HowItWorks() {
  const steps = [{
    n: "01",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 22
    }),
    t: "Download the wallet",
    d: "Get the Bhutan NDI app from the App Store or Google Play."
  }, {
    n: "02",
    icon: /*#__PURE__*/React.createElement(I.fingerprint, {
      size: 22
    }),
    t: "Verify once",
    d: "Confirm your identity and receive your foundational credentials."
  }, {
    n: "03",
    icon: /*#__PURE__*/React.createElement(I.scan, {
      size: 22
    }),
    t: "Scan to connect",
    d: "Scan a QR code to connect with any participating service."
  }, {
    n: "04",
    icon: /*#__PURE__*/React.createElement(I.check, {
      size: 22
    }),
    t: "Consent &amp; share",
    d: "Approve exactly what you share with a single biometric tap."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-sunken)",
      borderTop: "1px solid var(--border-grid)",
      borderBottom: "1px solid var(--border-grid)"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    kicker: "How it works",
    title: "From download to verified in minutes"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20
    }
  }, steps.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      background: "var(--ndi-mint-08)",
      border: "1px solid var(--border-grid)",
      color: "var(--accent)"
    }
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-faint)"
    }
  }, s.n)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "18px 0 6px",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--text-strong)"
    },
    dangerouslySetInnerHTML: {
      __html: s.t
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: "var(--text-muted)"
    },
    dangerouslySetInnerHTML: {
      __html: s.d
    }
  }))))));
}
function FAQ() {
  return /*#__PURE__*/React.createElement(Section, {
    kicker: "FAQ",
    title: "Questions, answered",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      q: "What is self-sovereign identity (SSI)?",
      a: "SSI is a model where you — not a company or government database — own and control your identity credentials directly on your device."
    }, {
      q: "Where is my data stored?",
      a: "Your credentials are stored encrypted in your wallet on your own device. There is no central honeypot of personal data."
    }, {
      q: "Is Bhutan NDI free for citizens?",
      a: "Yes. The wallet is free to download and use for accessing participating public and private services."
    }, {
      q: "Can organizations integrate NDI?",
      a: "Yes — organizations can issue and verify credentials using our developer SDKs and open standards."
    }]
  })));
}
function CTA({
  onDownload
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 32px var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border-strong)",
      background: "linear-gradient(135deg, rgba(18,65,67,0.6), rgba(20,27,41,0.9))",
      padding: "64px 56px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -80,
      left: "50%",
      transform: "translateX(-50%)",
      width: 400,
      height: 240,
      background: "radial-gradient(circle, rgba(90,201,148,0.25), transparent 70%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 44,
      letterSpacing: "-0.02em",
      color: "var(--text-strong)"
    }
  }, "Step into Bhutan's secure digital future"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px auto 0",
      maxWidth: 560,
      fontSize: 18,
      color: "var(--text-muted)"
    }
  }, "Download the wallet and take control of your identity today."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      justifyContent: "center",
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 18
    }),
    onClick: onDownload
  }, "Get the wallet"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg"
  }, "Contact us")))));
}
function Footer() {
  const cols = [["Product", ["For Users", "For Organizations", "Developers", "Use Cases"]], ["Company", ["About Us", "Careers", "News & Updates", "Governance"]], ["Resources", ["Documentation", "FAQ", "Glossary", "Support"]]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--border-grid)",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "56px 32px 32px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: `${LOGO}/ndi-horizontal-white.png`,
    alt: "Bhutan NDI",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      maxWidth: 280,
      fontSize: 14,
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, "The world's first national digital identity built on decentralized self-sovereign identity technology.")), cols.map(([h, links]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginBottom: 16
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: 14.5,
      color: "var(--text-muted)",
      textDecoration: "none"
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "20px 32px",
      borderTop: "1px solid var(--border-subtle)",
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--text-faint)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Bhutan NDI \xB7 Druk Holding & Investments"), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms")));
}
window.SiteParts = {
  Nav,
  Hero,
  LogoStrip,
  Features,
  HowItWorks,
  FAQ,
  CTA,
  Footer,
  Section,
  GridBG
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CredentialCard = __ds_scope.CredentialCard;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MonoLabel = __ds_scope.MonoLabel;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Tabs = __ds_scope.Tabs;

})();

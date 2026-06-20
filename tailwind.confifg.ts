import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // ── Navbar ──
        navIn: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        activeBlip: {
          "0%": { transform: "translateX(-50%) scaleX(0)", opacity: "0" },
          "60%": { transform: "translateX(-50%) scaleX(1.3)", opacity: "1" },
          "100%": { transform: "translateX(-50%) scaleX(1)", opacity: "1" },
        },
        iconPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        createPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,107,44,0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(255,107,44,0)" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateX(-50%) translateY(14px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(-50%) translateY(0) scale(1)",
          },
        },
        backdropIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        sheetIn: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        // ── Discover Page ──
        headerIn: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cardIn: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // ── Event Detail Page ──
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // ── Ticket Sheet ──
        rowIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        checkIn: {
          "0%": { opacity: "0", transform: "scale(0.4)" },
          "60%": { opacity: "1", transform: "scale(1.15)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        backdropOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        sheetOut: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        // ── Ticket Receipt ──
        verifyIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        checkPop: {
          "0%": { transform: "scale(0)" },
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        // Navbar
        navIn: "navIn 0.45s cubic-bezier(0.34,1.2,0.64,1) forwards",
        activeBlip: "activeBlip 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        iconPop: "iconPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        createPulse: "createPulse 2.4s ease-in-out infinite",
        slideUp: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards",
        backdropIn: "backdropIn 0.2s ease forwards",
        sheetIn: "sheetIn 0.32s cubic-bezier(0.34,1.2,0.64,1) forwards",
        // Discover Page
        headerIn: "headerIn 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards",
        slideDown: "slideDown 0.4s cubic-bezier(0.34,1.2,0.64,1) both",
        cardIn: "cardIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both",
        fadeIn: "fadeIn 0.3s ease forwards",
        // Event Detail Page
        slideUpFade: "slideUpFade 0.45s cubic-bezier(0.34,1.2,0.64,1) both",
        // Ticket Sheet
        rowIn: "rowIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both",
        checkIn: "checkIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        backdropOut: "backdropOut 0.2s ease forwards",
        sheetOut: "sheetOut 0.22s cubic-bezier(0.4,0,1,1) forwards",
        // Ticket Receipt
        verifyIn: "verifyIn 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards",
        checkPop: "checkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;

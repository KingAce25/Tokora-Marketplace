"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// Svg Icons

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke={active ? "#FF6B2C" : "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke={active ? "#FF6B2C" : "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function WalletIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke={active ? "#FF6B2C" : "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path
        d="M16 12a1 1 0 100 2 1 1 0 000-2z"
        fill={active ? "#FF6B2C" : "currentColor"}
        stroke="none"
      />
      <path d="M2 10h20" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke={active ? "#FF6B2C" : "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// Routes

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Discover", href: "/discover", icon: DiscoverIcon },
  { label: "Wallet", href: "/wallet", icon: WalletIcon },
  { label: "Profile", href: "/profile", icon: ProfileIcon },
] as const;

// Error Message

type ToastProps = { message: string; onDismiss: () => void };

function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0)    scale(1);   }
          to   { opacity: 0; transform: translateY(16px) scale(.96); }
        }
        .toast-enter { animation: slideUp   .28s cubic-bezier(.34,1.56,.64,1) forwards; }
      `}</style>
      <div
        className="toast-enter"
        style={{
          position: "fixed",
          bottom: "84px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#2a1a14",
          border: "1px solid #FF6B2C55",
          color: "#fff",
          fontSize: "13px",
          padding: "10px 18px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 9999,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 24px rgba(0,0,0,.5)",
          maxWidth: "88vw",
        }}
      >
        <span style={{ color: "#FF6B2C", fontSize: "16px" }}>⚠</span>
        {message}
        <button
          onClick={onDismiss}
          style={{
            marginLeft: "6px",
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "14px",
            lineHeight: 1,
            padding: 0,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </>
  );
}

// Create modal

function CreateSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const options = [
    { label: "List an Item", emoji: "🏷️" },
    { label: "Create Auction", emoji: "🔨" },
    { label: "Bundle Deal", emoji: "📦" },
    { label: "Flash Sale", emoji: "⚡" },
  ];
  return (
    <>
      <style>{`
        @keyframes backdropIn  { from{opacity:0} to{opacity:1} }
        @keyframes sheetIn     { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .sheet-bg  { animation: backdropIn .2s ease forwards; }
        .sheet-box { animation: sheetIn    .32s cubic-bezier(.34,1.2,.64,1) forwards; }
      `}</style>
      <div
        className="sheet-bg"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          zIndex: 9990,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        className="sheet-box"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1c1c1e",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 48px",
          zIndex: 9991,
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: "#3a3a3c",
            borderRadius: 99,
            margin: "0 auto 24px",
          }}
        />
        <p
          style={{
            color: "#888",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Create Listing
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {options.map((o) => (
            <button
              key={o.label}
              onClick={onClose}
              style={{
                background: "#2c2c2e",
                border: "1px solid #3a3a3c",
                borderRadius: 14,
                padding: "18px 12px",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                transition: "background .15s, transform .12s",
              }}
              onPointerDown={(e) =>
                (e.currentTarget.style.transform = "scale(.96)")
              }
              onPointerUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <span style={{ fontSize: 28 }}>{o.emoji}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Navbar

export default function Navbar() {
  const pathname = usePathname();
  const [pressed, setPressed] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Example: intercept wallet if not authenticated
  const handleNavClick = (href: string, label: string) => {
    if (href === "/wallet") {
      // Replace with real auth check
      const isAuthenticated = false;
      if (!isAuthenticated) {
        showToast("Connect your wallet to continue");
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <style>{`
        @keyframes navIn {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes activeBlip {
          0%   { transform:scaleX(0); opacity:0; }
          60%  { transform:scaleX(1.3); opacity:1; }
          100% { transform:scaleX(1); opacity:1; }
        }
        @keyframes iconPop {
          0%   { transform:scale(1); }
          40%  { transform:scale(1.25); }
          100% { transform:scale(1); }
        }
        @keyframes createPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,107,44,.35); }
          50%      { box-shadow: 0 0 0 10px rgba(255,107,44,0); }
        }
        .nav-item:active .nav-icon { animation: iconPop .25s ease forwards; }
        .nav-item-active .nav-icon { animation: iconPop .3s cubic-bezier(.34,1.56,.64,1) forwards; }
        .active-dot {
          animation: activeBlip .35s cubic-bezier(.34,1.56,.64,1) forwards;
          transform-origin: center;
        }
        .create-btn {
          animation: createPulse 2.4s ease-in-out infinite;
          transition: transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .15s;
        }
        .create-btn:active { transform: scale(.9) !important; }
        .nav-label {
          transition: color .2s, opacity .2s;
          font-family: 'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif;
        }
      `}</style>

      {/* Toast notification */}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Create sheet */}
      <CreateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: "#141414",
          borderTop: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "10px 4px 20px",
          animation: "navIn .45s cubic-bezier(.34,1.2,.64,1) forwards",
          // Safe area for iPhone home indicator
          paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* LEFT ITEMS: Home & Discover */}
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${active ? " nav-item-active" : ""}`}
              onClick={(e) => {
                if (!handleNavClick(item.href, item.label)) e.preventDefault();
                setPressed(item.href);
                setTimeout(() => setPressed(null), 300);
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                color: active ? "#FF6B2C" : "#6b6b6b",
                position: "relative",
                padding: "4px 0",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span className="nav-icon" style={{ display: "flex" }}>
                <Icon active={active} />
              </span>
              <span
                className="nav-label"
                style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#FF6B2C" : "#6b6b6b",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="active-dot"
                  style={{
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 3,
                    borderRadius: 99,
                    background: "#FF6B2C",
                  }}
                />
              )}
            </Link>
          );
        })}

        {/*  Create */}
        <button
          onClick={() => setSheetOpen(true)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            className="create-btn"
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "#FF6B2C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: -18,
              boxShadow: "0 4px 20px rgba(255,107,44,.45)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          <span
            className="nav-label"
            style={{ fontSize: 10, color: "#6b6b6b", letterSpacing: "0.02em" }}
          >
            Create
          </span>
        </button>

        {/*Wallet & Profile */}
        {NAV_ITEMS.slice(2).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${active ? " nav-item-active" : ""}`}
              onClick={(e) => {
                if (!handleNavClick(item.href, item.label)) e.preventDefault();
                setPressed(item.href);
                setTimeout(() => setPressed(null), 300);
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                color: active ? "#FF6B2C" : "#6b6b6b",
                position: "relative",
                padding: "4px 0",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span className="nav-icon" style={{ display: "flex" }}>
                <Icon active={active} />
              </span>
              <span
                className="nav-label"
                style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#FF6B2C" : "#6b6b6b",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="active-dot"
                  style={{
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 3,
                    borderRadius: 99,
                    background: "#FF6B2C",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

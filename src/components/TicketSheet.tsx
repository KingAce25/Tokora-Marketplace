"use client";

import { useState, useEffect } from "react";
import type { EventDetail, TicketTier } from "./types";

// ─── Props ──────────────────────────────────────────────────────────────────

interface TicketSheetProps {
  open: boolean;
  event: EventDetail;
  initialTierId: string | null;
  onClose: () => void;
  /** Called once payment confirmation succeeds — wire this to your real checkout result */
  onConfirmed?: (tierId: string) => void;
}

// ─── Skeleton row (lazy-load placeholder) ──────────────────────────────────────

function TierRowSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-[#1f1f1f] border border-white/5 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1 pr-4">
          <div className="h-3.5 w-2/5 bg-[#2a2a2a] rounded-full" />
          <div className="h-2.5 w-3/5 bg-[#2a2a2a] rounded-full" />
          <div className="h-2.5 w-1/4 bg-[#2a2a2a] rounded-full" />
        </div>
        <div className="h-4 w-14 bg-[#2a2a2a] rounded-full shrink-0" />
      </div>
    </div>
  );
}

// ─── Ticket tier row ────────────────────────────────────────────────────────────

function TierRow({
  tier,
  selected,
  onSelect,
  animationDelay,
}: {
  tier: TicketTier;
  selected: boolean;
  onSelect: () => void;
  animationDelay: string;
}) {
  const lowStock =
    tier.spotsLeft !== undefined && tier.spotsLeft <= 10 && !tier.soldOut;

  return (
    <button
      onClick={onSelect}
      disabled={tier.soldOut}
      style={{ animationDelay }}
      className={`
        animate-rowIn relative w-full text-left rounded-2xl px-4 py-3.5
        border transition-all duration-200 active:scale-[0.98]
        disabled:opacity-40 disabled:active:scale-100
        ${
          selected
            ? "bg-linear-to-r from-[#FF6B2C]/30 to-[#FF6B2C]/5 border-[#FF6B2C]"
            : "bg-[#1f1f1f] border-white/8"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-bold">{tier.name}</p>
            {tier.isMostPopular && !tier.soldOut && (
              <span className="text-[#FF6B2C] text-[9px] font-bold uppercase tracking-wide">
                Most popular
              </span>
            )}
          </div>
          <p className="text-[#8a8a8a] text-[11px] mt-0.5 leading-snug">
            {tier.perks}
          </p>
          {tier.spotsLeft !== undefined && (
            <p
              className={`text-[10px] mt-1.5 ${lowStock ? "text-red-400" : "text-[#6b6b6b]"}`}
            >
              {tier.soldOut ? "Sold out" : `${tier.spotsLeft} left`}
            </p>
          )}
        </div>
        <span className="shrink-0 text-white text-[15px] font-bold">
          {tier.priceLabel}
        </span>
      </div>

      {/* Selected check */}
      {selected && (
        <span className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-[#FF6B2C] flex items-center justify-center animate-checkIn">
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Main sheet ─────────────────────────────────────────────────────────────────

export default function TicketSheet({
  open,
  event,
  initialTierId,
  onClose,
  onConfirmed,
}: TicketSheetProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(
    initialTierId,
  );
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  // Reset + simulate a brief tier-availability refresh whenever the sheet opens.
  // In production this is where you'd re-fetch live spot counts so the user
  // never buys a ticket tier that just sold out.
  useEffect(() => {
    if (!open) return;
    setSelectedTier(initialTierId);
    setError(null);
    setLoadingTiers(true);

    // ── Replace with a real availability check ──────────────────────────────
    // fetch(`/api/events/${event.id}/tiers`)
    //   .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    //   .then(data => { /* merge fresh spotsLeft into tiers if needed */ })
    //   .catch(() => setError("Couldn't refresh ticket availability."))
    //   .finally(() => setLoadingTiers(false));
    // ──────────────────────────────────────────────────────────────────────────

    const t = setTimeout(() => setLoadingTiers(false), 450);
    return () => clearTimeout(t);
  }, [open, initialTierId, event.id]);

  if (!open) return null;

  const activeTier = event.ticketTiers.find((t) => t.id === selectedTier);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  };

  const handleContinue = async () => {
    if (!activeTier) return;
    setSubmitting(true);
    setError(null);
    try {
      // ── Replace with your real checkout/payment initiation call ─────────────
      // const res = await fetch(`/api/events/${event.id}/checkout`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ tierId: activeTier.id }),
      // });
      // if (!res.ok) {
      //   if (res.status === 409) throw new Error("That tier just sold out. Pick another.");
      //   throw new Error("Couldn't start checkout. Please try again.");
      // }
      // const { checkoutUrl } = await res.json();
      // router.push(checkoutUrl); // or onConfirmed(activeTier.id) if payment happens inline
      // ──────────────────────────────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 900));
      onConfirmed?.(activeTier.id);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`
          fixed inset-0 z-9990 bg-black/70 backdrop-blur-sm
          ${closing ? "animate-backdropOut" : "animate-backdropIn"}
        `}
      />

      {/* Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-9991
          bg-[#181818] rounded-t-3xl border-t border-white/8
          px-5 pt-3 pb-[max(100px,env(safe-area-inset-bottom))]
          max-h-[88vh] overflow-y-auto
          [-webkit-overflow-scrolling:touch]
          ${closing ? "animate-sheetOut" : "animate-sheetIn"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Select ticket"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#3a3a3c] rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="mb-5 animate-rowIn" style={{ animationDelay: "20ms" }}>
          <h2 className="text-white text-[19px] font-extrabold tracking-tight">
            Select Ticket
          </h2>
          <p className="text-[#8a8a8a] text-[13px] mt-0.5">{event.title}</p>
        </div>

        {/* Tier list */}
        <div className="space-y-2.5 mb-5">
          {loadingTiers ? (
            <>
              <TierRowSkeleton />
              <TierRowSkeleton />
              <TierRowSkeleton />
            </>
          ) : (
            event.ticketTiers.map((tier, i) => (
              <TierRow
                key={tier.id}
                tier={tier}
                selected={selectedTier === tier.id}
                onSelect={() => !tier.soldOut && setSelectedTier(tier.id)}
                animationDelay={`${60 + i * 60}ms`}
              />
            ))
          )}
        </div>

        {/* Inline error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={loadingTiers || submitting || !activeTier}
          className="
            w-full py-4 rounded-2xl bg-[#FF6B2C] text-white text-[15px] font-bold
            shadow-[0_4px_24px_rgba(255,107,44,0.4)]
            active:scale-[0.98] transition-transform duration-150
            disabled:opacity-50 disabled:active:scale-100
            flex items-center justify-center gap-2
          "
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : activeTier ? (
            `Continue to Payment · ${activeTier.priceLabel}`
          ) : (
            "Select a ticket"
          )}
        </button>
      </div>
    </>
  );
}

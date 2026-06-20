"use client";

import { useState, useEffect } from "react";
import type { EventDetail, TicketTier, PaymentMethod } from "./types";

// ─── Props ──────────────────────────────────────────────────────────────────

interface PaymentSheetProps {
  open: boolean;
  event: EventDetail;
  tier: TicketTier;
  onClose: () => void;
  /** Called once payment succeeds — wire this to navigate to a receipt/ticket screen */
  onSuccess?: (result: {
    tierId: string;
    method: string;
    txId: string;
    event: EventDetail;
    tier: TicketTier;
  }) => void;
}

// ─── Available payment methods ─────────────────────────────────────────────────
// Replace with a real fetch if methods vary per event/currency/region.

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "sol", symbol: "SOL", gasless: true },
  { id: "usdc", symbol: "USDC", gasless: false },
  { id: "usdt", symbol: "USDT", gasless: false },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatAmount(value: number, symbol: string) {
  if (value === 0) return "Free";
  if (symbol === "SOL" || symbol === "ETH")
    return `${value.toFixed(2)} ${symbol}`;
  return `${value.toLocaleString()} ${symbol}`;
}

// ─── Skeleton (lazy-load placeholder while fetching live quote) ───────────────

function SummarySkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-[#1f1f1f] border border-white/5 px-4 py-3.5 space-y-3">
      <div className="flex justify-between">
        <div className="h-3.5 w-28 bg-[#2a2a2a] rounded-full" />
        <div className="h-3.5 w-14 bg-[#2a2a2a] rounded-full" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-[#2a2a2a] rounded-full" />
        <div className="h-3 w-12 bg-[#2a2a2a] rounded-full" />
      </div>
      <div className="h-px bg-white/8" />
      <div className="flex justify-between">
        <div className="h-4 w-12 bg-[#2a2a2a] rounded-full" />
        <div className="h-4 w-16 bg-[#2a2a2a] rounded-full" />
      </div>
    </div>
  );
}

// ─── Main sheet ─────────────────────────────────────────────────────────────────

export default function PaymentSheet({
  open,
  event,
  tier,
  onClose,
  onSuccess,
}: PaymentSheetProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("sol");
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [networkFeeLabel, setNetworkFeeLabel] = useState("Gasless");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  // Re-quote whenever the sheet opens or the payment method changes —
  // gas/network fees can differ per token, so this should hit your real
  // pricing endpoint rather than being hardcoded.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoadingQuote(true);

    // ── Replace with a real quote fetch ──────────────────────────────────────
    // fetch(`/api/events/${event.id}/quote?tier=${tier.id}&method=${selectedMethod}`)
    //   .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    //   .then(data => setNetworkFeeLabel(data.feeLabel))
    //   .catch(() => setError("Couldn't get a live quote. Please try again."))
    //   .finally(() => setLoadingQuote(false));
    // ──────────────────────────────────────────────────────────────────────────

    const t = setTimeout(() => {
      const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
      setNetworkFeeLabel(method?.gasless ? "Gasless" : "~0.001 SOL");
      setLoadingQuote(false);
    }, 400);
    return () => clearTimeout(t);
  }, [open, selectedMethod, event.id, tier.id]);

  if (!open) return null;

  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const total = tier.priceValue;

  const handleClose = () => {
    if (submitting) return; // don't allow dismiss mid-transaction
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // ── Replace with your real payment/minting call ──────────────────────────
      // const res = await fetch(`/api/events/${event.id}/purchase`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ tierId: tier.id, paymentMethod: selectedMethod }),
      // });
      // if (res.status === 402) throw new Error("Payment declined. Check your wallet balance.");
      // if (res.status === 409) throw new Error("This tier just sold out.");
      // if (!res.ok) throw new Error("Payment failed. Please try again.");
      // const { txId } = await res.json();
      // onSuccess?.({ tierId: tier.id, method: selectedMethod, txId, event, tier });
      // ──────────────────────────────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 1200));
      const fakeTxId = `tx_${Math.random().toString(36).slice(2, 10)}`;
      onSuccess?.({
        tierId: tier.id,
        method: selectedMethod,
        txId: fakeTxId,
        event,
        tier,
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Payment failed. Please try again.",
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
          fixed inset-0 z-9994 bg-black/70 backdrop-blur-sm
          ${closing ? "animate-backdropOut" : "animate-backdropIn"}
        `}
      />

      {/* Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-9995
          bg-[#181818] rounded-t-3xl border-t border-white/8
          px-5 pt-3 pb-[max(100px,env(safe-area-inset-bottom))]
          max-h-[88vh] overflow-y-auto
          [-webkit-overflow-scrolling:touch]
          ${closing ? "animate-sheetOut" : "animate-sheetIn"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Confirm and pay"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#3a3a3c] rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="mb-5 animate-rowIn" style={{ animationDelay: "20ms" }}>
          <h2 className="text-white text-[19px] font-extrabold tracking-tight">
            Confirm &amp; Pay
          </h2>
          <p className="text-[#8a8a8a] text-[13px] mt-0.5">{event.title}</p>
        </div>

        {/* Order summary */}
        <div className="mb-5 animate-rowIn" style={{ animationDelay: "60ms" }}>
          {loadingQuote ? (
            <SummarySkeleton />
          ) : (
            <div className="rounded-2xl bg-[#1f1f1f] border border-white/8 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-semibold">
                  {tier.name}
                </span>
                <span className="text-[#FF6B2C] text-sm font-bold">
                  {tier.priceLabel}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[#8a8a8a] text-xs">Network fee</span>
                <span
                  className={`text-xs font-semibold ${networkFeeLabel === "Gasless" ? "text-emerald-400" : "text-[#8a8a8a]"}`}
                >
                  {networkFeeLabel}
                </span>
              </div>
              <div className="h-px bg-white/8 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-white text-[15px] font-bold">Total</span>
                <span className="text-[#FF6B2C] text-[15px] font-bold">
                  {tier.priceLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pay with */}
        <div className="mb-4 animate-rowIn" style={{ animationDelay: "100ms" }}>
          <p className="text-white text-sm font-bold mb-2.5">Pay with</p>
          <div className="flex gap-2.5">
            {PAYMENT_METHODS.map((m) => {
              const active = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  disabled={submitting}
                  className={`
                    flex-1 py-2.5 rounded-xl text-sm font-bold
                    border transition-all duration-200 active:scale-95
                    disabled:opacity-50
                    ${
                      active
                        ? "bg-[#FF6B2C]/15 border-[#FF6B2C] text-[#FF6B2C]"
                        : "bg-[#1f1f1f] border-white/10 text-[#aaa]"
                    }
                  `}
                >
                  {m.symbol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info banner */}
        <div
          className="mb-5 px-3.5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-rowIn"
          style={{ animationDelay: "140ms" }}
        >
          <p className="text-emerald-400 text-[12px] leading-snug">
            Your NFT ticket will be minted instantly to your wallet after
            payment.
          </p>
        </div>

        {/* Inline error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={loadingQuote || submitting}
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
              Confirming on-chain...
            </>
          ) : (
            "Continue Purchase"
          )}
        </button>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import type { MyTicket } from "../../../components/types";
import Image from "next/image";

// ─── Mock data layer (replace with real API) ──────────────────────────────────
// In production this disappears — useTicket()'s fetch call is what matters.
//
// This acts as a tiny in-memory "database" so that any ticket purchased via
// PaymentSheet (which generates a real txId) can be looked up here too,
// instead of only working for one hardcoded id. A real backend would persist
// the ticket row when /purchase succeeds, then return it here on GET.

const MOCK_TICKETS: Record<string, MyTicket> = {
  tk_8821: {
    id: "tk_8821",
    eventId: "1",
    eventTitle: "Web3 Lagos Summit 2025",
    date: "2025-06-14",
    time: "10:00 AM",
    venue: "Eko Convention Center",
    tierName: "General Access",
    txId: "tx_a91f3c2d",
    serial: "NFT #0042",
    issuer: "TOKORA MARKETPLACE",
    purchasedAt: "2026-06-10T14:32:00Z",
    verified: false,
    qrPayload: "tokora://verify/tk_8821",
  },
};

/**
 * Fallback generator: if a ticket id isn't in the mock store (e.g. it was
 * just "purchased" via PaymentSheet's random txId), synthesize one on the
 * fly instead of 404ing, so the demo flow always works end-to-end.
 *
 * It first checks sessionStorage for the real purchase details the event
 * detail page stashed right before navigating here (see handlePaymentSuccess
 * in app/events/[id]/page.tsx) — that's what makes the ticket correlate with
 * whichever event was actually bought, instead of always showing the same
 * placeholder event.
 *
 * DELETE this whole function (and the sessionStorage stash on the purchase
 * side) once your real API persists the ticket row during /purchase and
 * returns it correctly from GET /api/tickets/:id.
 */
function getOrCreateMockTicket(id: string): MyTicket | null {
  if (MOCK_TICKETS[id]) return MOCK_TICKETS[id];

  // Only auto-create for ids that look like they came from our own
  // PaymentSheet flow (txId-shaped), so truly invalid ids still 404.
  if (!/^tx_[a-z0-9]+$/i.test(id)) return null;

  // Pull the real event/tier the user actually purchased, if available.
  let purchased: {
    eventId: string;
    eventTitle: string;
    eventImageUrl?: string;
    date: string;
    time: string;
    venue: string;
    tierName: string;
  } | null = null;

  if (typeof window !== "undefined") {
    const raw = sessionStorage.getItem(`mock_ticket_${id}`);
    if (raw) {
      try {
        purchased = JSON.parse(raw);
      } catch {
        purchased = null;
      }
    }
  }

  const generated: MyTicket = {
    id,
    eventId: purchased?.eventId ?? "1",
    eventTitle: purchased?.eventTitle ?? "Event",
    eventImageUrl: purchased?.eventImageUrl,
    date: purchased?.date ?? new Date().toISOString().slice(0, 10),
    time: purchased?.time ?? "—",
    venue: purchased?.venue ?? "—",
    tierName: purchased?.tierName ?? "General Access",
    txId: id,
    serial: `NFT #${Math.floor(1000 + Math.random() * 9000)}`,
    issuer: "TOKORA MARKETPLACE",
    purchasedAt: new Date().toISOString(),
    verified: false,
    qrPayload: `tokora://verify/${id}`,
  };

  MOCK_TICKETS[id] = generated;
  return generated;
}

// ─── API hooks (wire your real endpoints here) ─────────────────────────────────

function useTicket(id: string) {
  const [ticket, setTicket] = useState<MyTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(() => {
    setLoading(true);
    setError(null);

    // ── Replace with your real API call ──────────────────────────────────────
    // fetch(`/api/tickets/${id}`)
    //   .then(r => {
    //     if (r.status === 404) throw new Error("NOT_FOUND");
    //     if (!r.ok) throw new Error(r.statusText);
    //     return r.json();
    //   })
    //   .then(data => setTicket(data))
    //   .catch(e => setError(e.message === "NOT_FOUND" ? "NOT_FOUND" : "Failed to load ticket. Please try again."))
    //   .finally(() => setLoading(false));
    // ──────────────────────────────────────────────────────────────────────────

    const timer = setTimeout(() => {
      try {
        const data = getOrCreateMockTicket(id);
        if (!data) setError("NOT_FOUND");
        else setTicket(data);
      } catch {
        setError("Failed to load ticket. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => fetchTicket(), [fetchTicket]);

  return { ticket, loading, error, refetch: fetchTicket, setTicket };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF6B2C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

// ─── QR code placeholder ────────────────────────────────────────────────────────
// Swap the dot grid for a real QR generated server-side from ticket.qrPayload
// (e.g. via `qrcode` package or a signed image URL from your API).

function QRPlaceholder({ onTap }: { onTap: () => void }) {
  // Deterministic pseudo-random pattern so it looks like a QR without being one
  const cells = Array.from({ length: 49 }, (_, i) => {
    const seed = (i * 7 + 13) % 11;
    return seed > 3;
  });

  return (
    <button
      onClick={onTap}
      className="w-full bg-[#e8e8e8] rounded-2xl py-5 px-4 flex flex-col items-center gap-3 active:scale-[0.98] transition-transform duration-150"
    >
      <div className="grid grid-cols-7 gap-1 w-30">
        {cells.map((filled, i) => (
          <span
            key={i}
            className={`aspect-square rounded-[1px] ${filled ? "bg-[#1a1a1a]" : "bg-transparent"}`}
          />
        ))}
      </div>
      <span className="text-[#555] text-[11px] font-bold tracking-wide uppercase">
        Tap to Verify
      </span>
    </button>
  );
}

// ─── Verified badge ─────────────────────────────────────────────────────────────

function VerifiedBadge({ verifiedAt }: { verifiedAt?: string }) {
  return (
    <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-2xl py-5 px-4 flex flex-col items-center gap-2 animate-verifyIn">
      <span className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center animate-checkPop">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <p className="text-emerald-400 text-sm font-bold">Attendance Confirmed</p>
      <p className="text-emerald-400/70 text-[11px]">Verified onchain</p>
    </div>
  );
}

// ─── Skeleton (lazy-load placeholder) ───────────────────────────────────────────

function TicketSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 w-full overflow-x-hidden overflow-y-auto bg-[#0f0f0f] text-white">
      <div className="px-4 pt-12 pb-2 text-center">
        <div className="h-7 w-40 bg-[#1e1e1e] rounded-lg mx-auto animate-pulse mb-2" />
        <div className="h-3.5 w-56 bg-[#1e1e1e] rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="px-4 mt-6">
        <div className="rounded-3xl overflow-hidden bg-[#1a1a1a] border border-white/8">
          <div className="h-35 bg-[#2a2a2a] animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-4 w-3/4 bg-[#1e1e1e] rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 w-10 bg-[#1e1e1e] rounded-full animate-pulse" />
                  <div className="h-3.5 w-20 bg-[#1e1e1e] rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-32 w-full bg-[#1e1e1e] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
      <div className="px-4 mt-8">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-[#1e1e1e] border border-white/10 text-white text-sm font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Not found / error states ───────────────────────────────────────────────────

function NotFoundState({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 w-full bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4 px-8 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-[#1e1e1e] flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF6B2C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <p className="text-white text-base font-semibold text-center">
        Ticket not found
      </p>
      <p className="text-[#6b6b6b] text-sm text-center">
        This ticket may have been removed or the link is invalid.
      </p>
      <button
        onClick={onClose}
        className="mt-2 px-6 py-2.5 rounded-full bg-[#FF6B2C] text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
      >
        Close
      </button>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  onClose,
}: {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 w-full bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4 px-8 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-[#6b6b6b] text-sm text-center max-w-[240px]">
        {message}
      </p>
      <div className="flex gap-3 mt-1">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full bg-[#1e1e1e] border border-white/10 text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
        >
          Close
        </button>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-full bg-[#FF6B2C] text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────────

export default function TicketReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { ticket, loading, error, refetch, setTicket } = useTicket(id);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleClose = () => {
    // Tickets live at a real URL (shareable / reopenable), so closing just
    // takes the user back rather than destroying any state — there's nothing
    // to lose, the receipt persists server-side.
    router.back();
  };

  const handleVerify = async () => {
    if (!ticket) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      // ── Replace with your real on-chain/venue verification call ─────────────
      // Typically this is actually triggered by a venue scanner hitting this
      // endpoint with the QR payload — this client-side tap is a demo/manual
      // fallback (e.g. "I'm at the venue, staff verified me, confirm here").
      // const res = await fetch(`/api/tickets/${ticket.id}/verify`, { method: "POST" });
      // if (!res.ok) throw new Error("Verification failed. Please try again or ask staff for help.");
      // const updated = await res.json();
      // setTicket(updated);
      await new Promise((r) => setTimeout(r, 1100));
      setTicket({
        ...ticket,
        verified: true,
        verifiedAt: new Date().toISOString(),
      });
    } catch (e) {
      setVerifyError(
        e instanceof Error
          ? e.message
          : "Verification failed. Please try again.",
      );
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <TicketSkeleton onClose={handleClose} />;
  if (error === "NOT_FOUND") return <NotFoundState onClose={handleClose} />;
  if (error)
    return (
      <ErrorState message={error} onRetry={refetch} onClose={handleClose} />
    );
  if (!ticket) return null;

  return (
    <div
      className="
      fixed inset-0 w-full overflow-x-hidden overflow-y-auto
      bg-[#0f0f0f] text-white pb-10
      font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
      [-webkit-overflow-scrolling:touch]
    "
    >
      {/* ── Header ── */}
      <div className="px-4 pt-12 pb-1 text-center animate-slideUpFade">
        <h1 className="text-[24px] font-extrabold tracking-tight">
          You&apos;re In!
        </h1>
        <p className="text-[#8a8a8a] text-[13px] mt-1">
          NFT ticket minted to your wallet
        </p>
      </div>

      {/* ── Ticket card ── */}
      <div
        className="px-4 mt-6 animate-slideUpFade"
        style={{ animationDelay: "60ms" }}
      >
        <div className="rounded-3xl overflow-hidden bg-[#1a1a1a] border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Event image */}
          <div className="relative w-full h-[140px] overflow-hidden">
            {ticket.eventImageUrl ? (
              <Image
                src={ticket.eventImageUrl}
                alt={ticket.eventTitle}
                className="w-full h-full object-cover"
                width={400}
                height={140}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          <div className="p-4">
            {/* Event title */}
            <h2 className="text-white text-[17px] font-bold leading-snug mb-3.5">
              {ticket.eventTitle}
            </h2>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-3.5 mb-4">
              <div>
                <p className="text-[#6b6b6b] text-[9px] uppercase tracking-wide mb-0.5">
                  Date
                </p>
                <p className="text-white text-[13px] font-semibold">
                  {formatDate(ticket.date)}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-[9px] uppercase tracking-wide mb-0.5">
                  Time
                </p>
                <p className="text-white text-[13px] font-semibold">
                  {ticket.time}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-[9px] uppercase tracking-wide mb-0.5">
                  Venue
                </p>
                <p className="text-white text-[13px] font-semibold truncate pr-2">
                  {ticket.venue}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-[9px] uppercase tracking-wide mb-0.5">
                  Tier
                </p>
                <p className="text-[#FF6B2C] text-[13px] font-semibold">
                  {ticket.tierName}
                </p>
              </div>
            </div>

            {/* Dashed divider — ticket-stub feel */}
            <div className="border-t border-dashed border-white/15 -mx-4 mb-4" />

            {/* QR / Verified state */}
            {ticket.verified ? (
              <VerifiedBadge verifiedAt={ticket.verifiedAt} />
            ) : (
              <>
                <QRPlaceholder onTap={handleVerify} />
                {verifying && (
                  <div className="flex items-center justify-center gap-2 mt-3 animate-fadeIn">
                    <span className="w-3.5 h-3.5 border-2 border-[#FF6B2C]/40 border-t-[#FF6B2C] rounded-full animate-spin" />
                    <span className="text-[#8a8a8a] text-xs">
                      Verifying onchain...
                    </span>
                  </div>
                )}
                {verifyError && (
                  <div className="mt-3 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
                    <p className="text-red-400 text-xs">{verifyError}</p>
                  </div>
                )}
              </>
            )}

            {/* Footer serial / issuer */}
            <p className="text-center text-[#4a4a4a] text-[10px] mt-4 tracking-wide">
              {ticket.serial} · {ticket.issuer}
            </p>
          </div>
        </div>
      </div>

      {/* ── Close button ── */}
      <div
        className="px-4 mt-8 animate-slideUpFade"
        style={{ animationDelay: "120ms" }}
      >
        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-full bg-[#1e1e1e] border border-white/10 text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-150"
        >
          Close
        </button>
      </div>
    </div>
  );
}
